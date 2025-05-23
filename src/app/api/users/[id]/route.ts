import { NextResponse } from "next/server";
import { updateUser } from "@/db/repositories/users";
import { deleteUser, findUserById } from "@/db/repositories/users";
//UPDATE USER
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number(id);
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
//DELETE USER
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const userId = Number(id);
  
  if (!userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const deletedUser = await deleteUser(userId);
  if (!deletedUser) {
      return NextResponse.json({ error: "User not found or delete failed" }, { status: 404 });
    }
  
  return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
}

// GET USER BY ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const user = await findUserById(Number(id));
    return NextResponse.json(user);
  }
  