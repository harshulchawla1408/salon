import "./globals.css";
import ClientRootLayout from "@/components/ClientRootLayout";

export const metadata = {
  title: "Gabru Look Salon",
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
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
