import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchBanner from "@/components/ui/searchBanner";
import '@fontsource/sansita';
import { findUserById } from "@/db/repositories/users";
import Image from "next/image";
import ProfileForm from "@/components/ui/profileForm";
import { AuthButton } from "@/components/ui/navigation-menu";
import DeleteUserBtn from "@/components/ui/deleteUserBtn";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const userId = id;

  if (!userId || userId === 'undefined') {
    return <div>Please sign in to view your profile.</div>;
  }

  const user = await findUserById(Number(userId));
  if (!user) {
    return (
      <>
        <SearchBanner />
        <div style={{ paddingTop: "150px", textAlign: "center" }}>
          <h1>User not Found</h1>
          <p>The requested profile could not be found.</p>
        </div>
      </>
    );
  }

  const isOwnProfile = (session?.user?.id === userId);

  // FOR FORM SUBMISSION TO UPDATE USER
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name"),
      username: formData.get("username"),
      password: formData.get("password"),
      profilePicture: formData.get("profilePicture"),
    };

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("User updated successfully!");
        console.log(result);
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <>
      <SearchBanner />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "40px",
          paddingTop: "100px",
          marginTop: "125px",
          marginRight: "25px",
          marginLeft: "150px",
          outline: "2px solid black",
          borderRadius: "10px",
          padding: "20px",
          position: "relative", 
        }}>
        {/* User Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: "20px",
            gap: "5px",
          }}>
          <h1 style={{ margin: 0 }}>{user.name}</h1>
          <h3 style={{ margin: 0 }}>{user.userName}</h3>
        </div>
        {/* Auth Button and Delete Button */}
        {isOwnProfile && (
          <div
            style={{
              position: "absolute", 
              top: "10px", 
              right: "10px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              gap: "15px", 
            }}>
            <AuthButton />
            <DeleteUserBtn userId={userId} />
          </div>
        )}
        {isOwnProfile ? (
          <ProfileForm
            userId={userId}
            defaultName={session.user.name ?? ""}
            defaultUsername={session.user.email ?? ""}/>
        ) : (
          <div>
            {/* PFP NOT WORKING> PUT IT HERE THO */}
            <h2 style={{ marginLeft: "20px" }}>{user?.name}</h2>
            <p style={{ marginLeft: "20px" }}>{user?.email}</p>
            <h2 style={{ marginLeft: "20px" }}>Username:</h2>
            <p style={{ marginLeft: "20px" }}>{user?.userName}</p>
          </div>
        )}
      </div>
      <div
        style={{
          marginLeft: "150px",
          marginRight: "25px",
          paddingTop: "20px",
          outline: "2px solid black",
          borderRadius: "10px",
        }}>
        {isOwnProfile ? (
          <h1>Your Posts:</h1>
        ) : (
          <h1>{user?.userName}'s Posts:</h1>
        )}
      </div>
    </>
  );
}