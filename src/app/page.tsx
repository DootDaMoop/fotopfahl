import { AuthButton } from "@/components/ui/navigation-menu";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: "#D2E3F6",
          padding: "20px", // Increased padding for a larger banner
          width: "100%", // Full width of the screen
          position: "fixed", // Fixed at the top
          top: 0,
          left: 0, // Start from the left edge
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Space between favicon/title
          height: "100px", // Increased height for a bigger banner
        }}
      >
        {/* Favicon and Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/favicon.ico" // Replace with the actual path to your favicon
            alt="Favicon"
            style={{ width: "32px", height: "32px" }} // Increased size for the favicon
          />
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span style={{ fontSize: "48px", fontWeight: "bold", color: "#064789" }}>Fotophal</span>
    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#064789", margin: 0 }}>
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
          marginTop: "100px", // Push content below the larger banner
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

          {/* Form */}
          <form
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #ccc", // Light outline for the form
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="username" style={{ display: "block", marginBottom: "5px" }}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "black", // Black background for the button
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%", // Stretch across the form
              }}
            >
              Submit
            </button>
          </form>

          {/* Sign-In Button */}
          <div style={{ marginTop: "20px" }}>
            <AuthButton />
          </div>
        </div>
      </div>
    </>
);
};
