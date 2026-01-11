"use client";

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        padding: "4rem 2rem",
        backgroundColor: "#0a0a0a",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: "#d4af37", fontSize: "2.5rem", marginBottom: "2rem" }}>
          Contact Us
        </h2>
        <p style={{ color: "#ffffff", fontSize: "1.1rem", lineHeight: "1.8" }}>
          Get in touch with us for bookings and inquiries.
        </p>
      </div>
    </section>
  );
}
