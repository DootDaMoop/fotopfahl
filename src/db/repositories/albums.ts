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
        const updatedAlbum = await db
            .updateTable('album')
            .set({
                albumName: updatedData.albumName,
                description: updatedData.description,
                images: updatedData.image,
            })
            .where('id', '=', albumId)
            .returning(['id', 'albumName', 'description', 'images'])
            .executeTakeFirst();

        return updatedAlbum;
    } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('Post update failed');
    }
}

//export async function 