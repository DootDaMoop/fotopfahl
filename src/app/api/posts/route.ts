//ONLY ROUTES THAT DONT REQUIRE AN ID!!!!!!!!!!!!!!!!!

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as postRepo from "@/db/repositories/posts";

//CREATE POST
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const body = await req.json();
        if (!body.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const postData = {
            userId: Number(session.user.id) ,
            title: body.title,
            description: body.description || null,
            images: body.images || null,
            mapData: {
                lat: body.mapData?.lat || 0,
                lng: body.mapData?.lng || 0,
                location: body.mapData?.location || null,
            },
            dataPermission: body.dataPermission || null,
            likes: 0,
        };

        const newPost = await postRepo.createPost(postData);
        return NextResponse.json({message: 'Post created successfully', newPost}, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//GET ALL POSTS
export async function GET(){
    try {
        const posts = await postRepo.getAllPosts();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}