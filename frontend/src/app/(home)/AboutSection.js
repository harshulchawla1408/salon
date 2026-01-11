"use client";

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "4rem 2rem",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: "#d4af37", fontSize: "2.5rem", marginBottom: "2rem" }}>
          About Us
        </h2>
        <p style={{ color: "#ffffff", fontSize: "1.1rem", lineHeight: "1.8" }}>
          Premium grooming services with personalized luxury.
        </p>
      </div>
    </section>
  );
}
