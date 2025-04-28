import Link from "next/link";

export function RegistrationButton() {
    return (
        <Link href="/register">
            <button
            style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            >
            Register
            </button>
        </Link>
    );
}

export default RegistrationButton;