"use client";

export default function Footer() {
  return (
    <footer style={{
      padding: "3rem 2rem",
      textAlign: "center",
      borderTop: "1px solid rgba(212, 175, 55, 0.2)",
      marginTop: "4rem"
    }}>
      <p style={{ color: "#d4af37", fontSize: "0.9rem", margin: 0 }}>
        © {new Date().getFullYear()} Gabru Look Salon. All rights reserved.
      </p>
    </footer>
  );
}
