import Link from "next/link";

export function RegistrationButton() {
  return (
    <Link href="/register" style={{ width: "100%" }}>
      <button
        style={{
          width: "100%",  // Set width to 50%
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}>
        Register
      </button>
    </Link>
  );
}
export default RegistrationButton;