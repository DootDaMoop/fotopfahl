import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as commentRepo from "@/db/repositories/comments"; // Replace with your actual comments repository

//Delete Comment 
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const commentId = Number(params.id);
        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const deletedComment = await commentRepo.deleteComment(commentId); // Delete the comment from the database
        return NextResponse.json({ message: "Comment deleted successfully", deletedComment }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//Uodate comment 
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        console.log(req.method, req.body); 
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const commentId = Number(id);
        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
        }

        const updatedCommentData = {
            content: body.content,
        };
        const updatedComment = await commentRepo.updateComment(commentId, updatedCommentData); 
        // or req.params depending on framework

        console.log(updatedComment)// Update the comment in the database
        return NextResponse.json({ message: "Comment updated successfully", updatedComment }, { status: 200 });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}