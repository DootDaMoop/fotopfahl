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
    const newPost = await db
        .insertInto('post')
        .values(post)
        .returning(['id', 'userId', 'title', 'image'])
        .executeTakeFirst();
    return newPost
}