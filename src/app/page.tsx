import { AuthButton } from "@/components/ui/navigation-menu";
import { getServerSession } from "next-auth";
import '@fontsource/sansita'; 

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: "#D2E3F6",
          padding: "20px", 
          width: "100%",
          position: "fixed", 
          top: 0,
          left: 0, 
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", 
          height: "100px", 
        }}
      >
        {/* Favicon and Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/favicon.ico" 
            alt="Favicon"
            style={{ width: "32px", height: "32px" }} 
          />
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span
      className="title"
      style={{
        fontSize: "48px",
        fontWeight: "bold",
        color: "#064789",
        fontFamily: "'Sansita', sans-serif", 
      }}
    >
      Fotophal
    </span>
    <p
      className="subtitle"
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "#064789",
        margin: 0,
        fontFamily: "'Sansita', sans-serif",
      }}
    >
      A photo sharing application for photographers
    </p>
  </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "calc(100vh - 100px)", // Subtract the new banner height from the viewport height
          margin: 0,
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px", padding: "20px", textAlign: "center" }}>
          {/* Page Content */}
          <div>
            {session?.user?.name ? (
              <div>Welcome, {session?.user?.name}</div>
            ) : (
              <div>Not signed in</div>
            )}
          </div>

  {/* Auth Button component. go to other sign in options */}
  <div style={{ width: "100%" }}>
    <AuthButton />
  </div>
        </div>
      </div>
    </>
);
};
