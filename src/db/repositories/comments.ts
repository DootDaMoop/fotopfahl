import { db } from '@/db/db.ts'
import type { CommentTable } from '../types'

export async function createComment(comment: Omit<CommentTable, 'id'>) {
    try {
        // Validate input
        if (!comment.postId || !comment.userId || !comment.content) {
            throw new Error("Invalid comment data: postId, userId, and content are required");
        }

        // Insert comment into the database
        const newComment = await db
            .insertInto('comment')
            .values({
                ...comment,
                //createdAt: new Date(), // Add the current timestamp
            })
            .returning(['id', 'postId', 'userId', 'content']) // Include createdAt in the returned fields
            .executeTakeFirst();

        return newComment;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
    }
}

export async function findCommentsByPostId(postId: number) {
    const comments = await db
        .selectFrom('comment')
        .selectAll()
        .where('postId', '=', postId)
        .execute();
    return comments
}

export async function deleteComment(commentId: number) {
    const deletedComment = await db
        .deleteFrom('comment')
        .where('id', '=', commentId)
        .returning(['id', 'postId', 'userId', 'content'])
        .executeTakeFirst();
    return deletedComment
}

export async function updateComment(commentId: number, updatedData: any) {
    const updatedComment = await db
        .updateTable('comment')
        .set({
            content: updatedData.content,
        })
        .where('id', '=', commentId)
        .returning(['id', 'postId', 'userId', 'content'])
        .executeTakeFirst();
    return updatedComment
}

export async function countCommentsByPostId(postId: number) {
    const count = await db
        .selectFrom('comment')
        .select(db.fn.count('id').as('count'))
        .where('postId', '=', postId)
        .executeTakeFirst();
    return count?.count || 0;
}