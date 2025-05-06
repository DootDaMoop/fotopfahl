import Link from "next/link";
import { AuthButton } from "@/components/ui/navigation-menu";
import { getServerSession } from "next-auth";
import '@fontsource/sansita'; 
import SignInBanner from "@/components/ui/sign-in-banner";
import RegistrationButton from "@/components/ui/registrationButton";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <SignInBanner />
      {/* Page Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)",
          margin: 0,
          marginTop: "125px",
        }}>
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            textAlign: "center",
          }}>
          <div style={{ marginBottom: "20px" }}>
            {session?.user?.name ? (
              <div>Welcome, {session?.user?.name}</div>
            ) : (
              <div>
                <h2 style={{ fontFamily: "'Sansita', sans-serif" }}>
                  Welcome to Fotophal!
                </h2>
                <p
                  style={{
                    fontFamily: "'Sansita', sans-serif",
                    fontSize: "18px", // increased from default
                    lineHeight: "1.6",
                  }}>
                  Looks like you're not signed in. If you're new here hit the
                  "Register" button and create an account. If you have an
                  account go ahead and click the sign in button below!
                </p>
              </div>
            )}

            {/* Register and Signin Options */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",  
                alignItems: "center",      
                gap: "20px",              
                marginTop: "20px",
                flexDirection: "row",     
              }}>
              <RegistrationButton />
              <AuthButton />
            </div>
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
}
