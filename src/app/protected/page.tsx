import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function ProtectedPage() {
    const session = await getServerSession();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div>
            This is a protected route. You are signed in as {session.user.name}
            <br />
            You will only see this if you are authenticated.
        </div>
    )
};
