import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchBanner from "@/components/ui/searchBanner";
import '@fontsource/sansita';
import { findUserById } from "@/db/repositories/users";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = params.id;

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }
  const user = await findUserById(Number(userId));
  if(!user){return <h1>User not Found</h1>}

  const isOwnProfile = (session?.user?.id === userId);
  
  console.log("Session User ID:", session.user.id);
  console.log("Params ID:", userId);
  console.log("Is Own Profile:", isOwnProfile);

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
        }}>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src={user.profilePicture || ""}
            alt={user.userName || "Profile Picture"}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              outline: "2px solid black",
            }} />
          <h1 style={{ marginLeft: "20px" }}>{user.userName}</h1>
        </div>

        {isOwnProfile ? (
          <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
            <label htmlFor="name" style={{ marginTop: "15px" }}>Name:</label>
            <input type="text" id="name" name="name" defaultValue={session.user.name || ""} />

            <label htmlFor="username" style={{ marginTop: "15px" }}>Username:</label>
            <input type="text" id="username" name="username" defaultValue={session.user.email || ""} />

            <label htmlFor="password" style={{ marginTop: "15px" }}>Password:</label>
            <input type="password" id="password" name="password" />

            <label htmlFor="profilePicture" style={{ marginTop: "15px" }}>Profile Picture:</label>
            <input type="file" id="profilePicture" name="profilePicture" />

            <button type="submit"
              style={{
                marginTop: "20px",
                padding: "10px 15px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}>
              Submit
            </button>
          </form>
        ) : (
          <div>
              <img
                src={user?.profilePicture || ""}
                alt="Profile Picture"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }} />
            <h2 style={{ marginLeft: "20px" }}>{user?.name}</h2>
            <p style={{ marginLeft: "20px" }}>{user?.email}</p>
            <h2 style={{ marginLeft: "20px" }}>Username:</h2>
            <p style={{ marginLeft: "20px" }}>{user?.userName}</p>
          </div>
        )}
      </div>
      <div style={{ marginLeft: "150px", marginRight: "25px", paddingTop: "20px", outline: "2px solid black", borderRadius: "10px" }}>
        {isOwnProfile ? (
          <h1>Your Posts:</h1>
        ) : (
          <h1>{user?.userName}'s Posts:</h1>
        )}
      </div>
    </>
  );
}
