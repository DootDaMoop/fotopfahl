import { db } from '@/db/db.ts'
import type { AlbumTable } from '../types'

export async function createAlbum(album: Omit<AlbumTable, 'id'>) {
    try {
        if (!album.albumName || !album.userId) {
            throw new Error("Invalid album data: albumName and userId are required");
        }

        const albumData = {
            ...album,
            images: album.images || null,
        };

        const newAlbum = await db
            .insertInto('album')
            .values(albumData)
            .returning(['id', 'albumName', 'description', 'userId', 'images'])
            .executeTakeFirst();

        return newAlbum;
    } catch (error) {
        console.error("Error creating album:", error);
        throw new Error("Failed to create album");
    }
}

export async function getAlbumById(albumId: number) {
    try {
        const album = await db
            .selectFrom('album')
            .selectAll()
            .where('id', '=', albumId)
            .executeTakeFirst();
        
        return album;
    } catch (error) {
        console.error("Error fetching album by ID:", error);
        throw new Error("Failed to fetch album");
    }
}

export async function getAlbumsByUserId(userId: number) {
    try {
        const albums = await db
            .selectFrom('album')
            .selectAll()
            .where('userId', '=', userId)
            .execute();
        
        return albums;
    } catch (error) {
        console.error("Error fetching albums by user ID:", error);
        throw new Error("Failed to fetch user albums");
    }
}

export async function getAllAlbums() {
    const albums = await db
        .selectFrom('album')
        .selectAll()
        .execute();
    return albums;
}

export async function updateAlbum(albumId: number, updatedData: any) {
    try {
        const updatedAlbum = await db
            .updateTable('album')
            .set({
                albumName: updatedData.albumName,
                description: updatedData.description,
                images: updatedData.images,
            })
            .where('id', '=', albumId)
            .returning(['id', 'albumName', 'description', 'images'])
            .executeTakeFirst();

        return updatedAlbum;
    } catch (error) {
        console.error('Failed to update album:', error);
        throw new Error('Album update failed');
    }
}

export async function deleteAlbum(albumId: number) {
    try {
        const deletedAlbum = await db
            .deleteFrom('album')
            .where('id', '=', albumId)
            .returning(['id', 'albumName', 'description', 'userId', 'images'])
            .executeTakeFirst();
        
        return deletedAlbum;
    } catch (error) {
        console.error("Error deleting album:", error);
        throw new Error("Failed to delete album");
    }
}