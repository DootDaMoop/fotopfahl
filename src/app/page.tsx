import { AuthButton } from "@/components/ui/navigation-menu";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <AuthButton />
      getServerSession Result
      {session?.user?.name ? (
        <div>
          {session?.user?.name}</div>
      ) : (
        <div>Not signed in</div>
      )}
    </>
  );
};
