import { db } from '@/db/db.ts'
import type { PostTable } from '../types'

export async function findPostById(id: number) {
    const post = await db
        .selectFrom('post')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
    return post
}

export async function findPostsByUserId(userId: number) {
    const posts = await db
        .selectFrom('post')
        .selectAll()
        .where('userId', '=', userId)
        .execute();
    return posts
}

export async function createPost(post: Omit<PostTable, 'id'>) {
    const postData = {
        ...post,
        images: post.images ? JSON.stringify(post.images) : null,
    };

    const newPost = await db
        .insertInto('post')
        .values(postData)
        .returning(['id', 'userId', 'title', 'images'])
        .executeTakeFirst();
    return newPost
}

export async function getAllPosts() {
    const posts = await db
        .selectFrom('post')
        .selectAll()
        .execute();
    return posts
}

export async function deletePost(postId: number) {
    const deletedPost = await db
        .deleteFrom('post')
        .where('id', '=', postId)
        .returning(['id', 'userId', 'title', 'images'])
        .executeTakeFirst();
    return deletedPost
}

export async function updatePost(postId: number, updatedData: any) {
    try {
        const updatedPost = await db
            .updateTable('post')
            .set({
                title: updatedData.title,
                description: updatedData.description,
                images: updatedData.images ? JSON.stringify(updatedData.images) : null,
                mapData: {
                    lat: updatedData.mapData?.lat || 0,
                    lng: updatedData.mapData?.lng || 0,
                    location: updatedData.mapData?.location || 'Unknown',
                },
                dataPermission: updatedData.dataPermission || null,
            })
            .where('id', '=', postId)
            .returning(['id', 'title', 'description', 'images'])
            .executeTakeFirst();

        return updatedPost;
    } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('Post update failed');
    }
}