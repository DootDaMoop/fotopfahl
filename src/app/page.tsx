//THIS IS THE INTIAL PAGE FOR THE APP




import Link from "next/link";
import { AuthButton } from "@/components/ui/navigation-menu";
//import Logo from "@/components/ui/logo";
import { getServerSession } from "next-auth";
import '@fontsource/sansita'; 
import SignInBanner from "@/components/ui/sign-in-banner";
import HomePage from "@/app/homePage/page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationButton from "@/components/ui/registrationButton";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
<>
<SignInBanner/>
{/* Page Content */}
  <div
    style={{
      display: "flex",
      justifyContent: "center", 
      alignItems: "center", 
      height: "calc(100vh - 100px)", 
      margin: 0,
    }}>
  <div style={{ width: "100%", maxWidth: "400px", padding: "20px", textAlign: "center" }}>
<div style={{  marginBottom: "20px" }}>
  {session?.user?.name ? (
    <div>Welcome, {session?.user?.name}</div>
  ) : (
    <div>
      <h2 style={{
        fontFamily: "'Sansita', sans-serif"}}>
        Welcome to Fotophal!
      </h2>
      <p style={{
        fontFamily: "'Sansita', sans-serif"}}>
        Looks like you're not signed in. Click the sign in button below to view our sign in options!
      </p>
      <RegistrationButton />
    </div>
  )}
</div>

{/* Auth Button component. Essentialy a nav to log in  */}
  <div style={{ width: "100%" }}>
    <AuthButton />
  </div>
    {/* Button to navigate to HomePage */}
    <div style={{ marginTop: "20px" }}>
      <Link href="/homePage">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Go to Home Page
        </button>
      </Link>
    </div>
  </div>
</div>
</>
);
};
