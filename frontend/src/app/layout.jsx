import "./globals.css";

export const metadata = {
  title: "Urban Gabhru Salon",
  description: "Luxury grooming experience in Australia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#0f0f0f",
          color: "#ffffff",
        }}
      >
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #222",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>Urban Gabhru</strong>
          <span style={{ opacity: 0.7 }}>Salon Platform</span>
        </header>

        <main style={{ padding: "24px" }}>{children}</main>
      </body>
    </html>
  );
}
