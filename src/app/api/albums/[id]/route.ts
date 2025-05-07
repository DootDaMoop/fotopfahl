import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as albumRepo from "@/db/repositories/albums";

// GET A SINGLE ALBUM
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const albumId = Number(id);
    
    try {
        const album = await albumRepo.getAlbumById(albumId);

        if (!album) {
            return NextResponse.json({ error: "Album not found" }, { status: 404 });
        }

        return NextResponse.json(album);
    } catch (error) {
        console.error("Error fetching album:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// UPDATE ALBUM
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const albumId = Number(id);
    
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        
        if (!body.albumName) {
            return NextResponse.json({ error: "Album name is required" }, { status: 400 });
        }

        // First check if the album exists and if the user owns it
        const existingAlbum = await albumRepo.getAlbumById(albumId);
        
        if (!existingAlbum) {
            return NextResponse.json({ error: "Album not found" }, { status: 404 });
        }
        
        if (existingAlbum.userId !== Number(session.user.id)) {
            return NextResponse.json({ error: "Unauthorized: You don't own this album" }, { status: 403 });
        }

        const updatedAlbum = await albumRepo.updateAlbum(albumId, body);
        
        return NextResponse.json({ 
            message: "Album updated successfully", 
            album: updatedAlbum 
        });
    } catch (error) {
        console.error("Error updating album:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE ALBUM
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const albumId = Number(id);
    
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // First check if the album exists and if the user owns it
        const existingAlbum = await albumRepo.getAlbumById(albumId);
        
        if (!existingAlbum) {
            return NextResponse.json({ error: "Album not found" }, { status: 404 });
        }
        
        if (existingAlbum.userId !== Number(session.user.id)) {
            return NextResponse.json({ error: "Unauthorized: You don't own this album" }, { status: 403 });
        }

        const deletedAlbum = await albumRepo.deleteAlbum(albumId);
        
        return NextResponse.json({ 
            message: "Album deleted successfully", 
            album: deletedAlbum 
        });
    } catch (error) {
        console.error("Error deleting album:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}