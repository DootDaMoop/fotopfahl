import { NextResponse } from "next/server";
import { updateUser } from "@/db/repositories/users";
import { deleteUser } from "@/db/repositories/users";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = Number(params.id);
  const body = await req.json();

  if (!userId || !body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updatedUser = await updateUser(userId, body);

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
  }

  return NextResponse.json({ message: "User updated successfully", user: updatedUser });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const userId = Number(params.id);
    
    if (!userId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
        return NextResponse.json({ error: "User not found or delete failed" }, { status: 404 });
      }
    
    return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
}