import { NextResponse } from "next/server";
import { findPostById, updatePost, deletePost } from "@/db/repositories/posts";

// GET A SINGLE POST
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = await findPostById(postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// UPDATE POST
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const body = await req.json();

  if (!postId || !body || !body.title || !body.image) {
    return NextResponse.json({ error: "Title and image are required" }, { status: 400 });
  }

  const updatedPost = await updatePost(postId, body);
  if (!updatedPost) {
    return NextResponse.json({ error: "Post not found or update failed" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post updated successfully", post: updatedPost });
}

// DELETE POST
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const postId = Number(params.id);

  if (!postId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const deletedPost = await deletePost(postId);
  if (!deletedPost) {
    return NextResponse.json({ error: "Post not found or delete failed" }, { status: 404 });
  }

  return NextResponse.json({ message: "Post deleted successfully", post: deletedPost });
}
