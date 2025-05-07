import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as albumRepo from "@/db/repositories/albums";

// CREATE ALBUM
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const body = await req.json();
        if (!body.albumName) {
            return NextResponse.json({ error: "Album name is required" }, { status: 400 });
        }

        const albumData = {
            userId: Number(session.user.id),
            albumName: body.albumName,
            description: body.description || "",
            images: body.images || null,
        };

        const newAlbum = await albumRepo.createAlbum(albumData);
        return NextResponse.json({message: 'Album created successfully', newAlbum}, { status: 201 });
    } catch (error) {
        console.error("Error creating album:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET ALL ALBUMS
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (userId) {
            // If userId is provided, get albums for specific user
            const albums = await albumRepo.getAlbumsByUserId(Number(userId));
            return NextResponse.json(albums, { status: 200 });
        } else {
            // Otherwise, get all albums
            const albums = await albumRepo.getAllAlbums();
            return NextResponse.json(albums, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching albums:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}