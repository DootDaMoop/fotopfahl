//ONLY ROUTES THAT REQUIRE AN ID*****

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as postRepo from "@/db/repositories/posts";

//GET A SINGLE POST
export async function GET_SINGLE_POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = Number(params.id);
        const post = await postRepo.findPostById(postId);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//UPDATE POST 
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = Number(params.id);
        const body = await request.json();

        if (!body.title || !body.image) {
            return NextResponse.json({ error: "Title and image are required" }, { status: 400 });
        }

        const updatedPost = await postRepo.updatePost(postId, body);
        if (!updatedPost) {
            return NextResponse.json({ error: "Post not found or update failed" }, { status: 404 });
        }
        return NextResponse.json({ message: "Post updated successfully", updatedPost }, { status: 200 });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//DELETE POSTS
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = Number(params.id);
        const deletedPost = await postRepo.deletePost(postId);
        if (!deletedPost) {
            return NextResponse.json({ error: "Post not found or delete failed" }, { status: 404 });
        }
        return NextResponse.json({ message: "Post deleted successfully", deletedPost }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}