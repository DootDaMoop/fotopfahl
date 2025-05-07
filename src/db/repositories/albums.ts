import { db } from '@/db/db.ts'
import type { AlbumTable } from '../types'

//export async function createAlbum;

//export async function getAlbumByID;

export async function getAllAlbums() {
    const albums = await db
    .selectFrom('album')
    .selectAll()
    return albums
}

export async function updateAlbum(albumId: number, updatedData: any) {
    try {
        const updatedPost = await db
            .updateTable('album')
            .set({
                title: updatedData.title,
                description: updatedData.description,
                images: updatedData.image,
            })
            .where('id', '=', albumId)
            .returning(['id', 'title', 'description', 'images'])
            .executeTakeFirst();

        return updatedPost;
    } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('Post update failed');
    }
}

//export async function 