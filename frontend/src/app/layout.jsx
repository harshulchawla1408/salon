import "./globals.css";
import Image from "next/image";

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
        <header className="luxury-header">
          <div className="header-left">
            <button className="book-button" type="button">
              Book Now
            </button>
          </div>

          <div className="header-center">
            <div className="logo-container">
              <Image
                src="/logo1.png"
                alt="Salon Logo"
                width={180}
                height={90}
                priority
                className="logo"
              />
            </div>
          </div>

          <div className="header-right">
            <nav className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              <a href="#shop">E-Shop</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
