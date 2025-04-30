import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { GetServerSideProps } from "next";
import '@fontsource/sansita';
import SearchBanner from "@/components/ui/searchBanner";

interface ProfilePageProps {
  session: {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    };
  } | null;
  currentUserEmail: string | null; 
}

const ProfilePage: React.FC<ProfilePageProps> = ({ session, currentUserEmail }) => {
  if (!session) {
    return <div>Please sign in to view your profile.</div>;}

  // CHECK IF THE LOGGED IN USER IS VIEWING THEIR OWN PROFILE
  const isOwnProfile = session.user.email === currentUserEmail;

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
            src={session.user.image || ""}
            alt={session.user.name || "Profile Picture"}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              outline: "2px solid black",
            }}/>
          <h1 style={{ marginLeft: "20px" }}>{session.user.name}</h1>
        </div>

        {/* ONLY SHOW FORM IF IT IS THE USERS PROFILE*/}
        {isOwnProfile ? (
          <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
            <label htmlFor="name" style={{ marginTop: "15px" }}>
              Name:
            </label>
            <input type="text" id="name" name="name" defaultValue={session.user.name || ""} />

            <label htmlFor="username" style={{ marginTop: "15px" }}>
              Username:
            </label>
            <input type="text" id="username" name="username" defaultValue={session.user.email || ""} />

            <label htmlFor="password" style={{ marginTop: "15px" }}>
              Password:
            </label>
            <input type="password" id="password" name="password" defaultValue={""} />

            <label htmlFor="profilePicture" style={{ marginTop: "15px" }}>
              Profile Picture:
            </label>
            <input type="file" id="profilePicture" name="profilePicture" />

            <button
              type="submit"
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
            <h2>{session.user.name}</h2>
            <p>{session.user.email}</p>
          </div>
        )}
      </div>
      <div style={{ marginLeft: "150px", marginRight: "25px", paddingTop: "20px", outline: "2px solid black", borderRadius: "10px"}}>
        {isOwnProfile ? (
          <h1>Your Posts:</h1>
        ) : (
          <h1></h1>
        )}
        {/* DIV FOR POSTS ***style more with an if so we can either display "your posts" or "user's posts" */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: { session: null, currentUserEmail: null } };
  }

  // Get the logged-in user's email
  const currentUserEmail = session.user.email;

  // Sanitize the session object to ensure it's serializable
  const cleanedSession = {
    user: {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
    },
  };

  return {
    props: {
      session: cleanedSession,
      currentUserEmail, // Pass the current user's email as a prop
    },
  };
};

export default ProfilePage;
