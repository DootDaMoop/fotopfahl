// /app/api/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as commentRepo from "@/db/repositories/comments"; // Replace with your actual comments repository

// POST: Add a new comment
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        if (!body.content || !body.postId) {
            return NextResponse.json({ error: "Text and postId are required" }, { status: 400 });
        }

        const commentData = {
            userId: Number(session.user.id),
            postId: Number(body.postId),
            content: body.text, // Renamed 'text' to 'content' to match the expected type
        };

        const newComment = await commentRepo.createComment(commentData); // Save the comment in the database
        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET: Fetch comments for a specific post by postId in query
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = Number(searchParams.get("postId"));  // Fetch postId from query string

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const comments = await commentRepo.findCommentsByPostId(postId);  // Fetch comments for the post
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
