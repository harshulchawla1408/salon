"use client";

import LoginModal from "@/components/LoginModal";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <LoginModal />
      </body>
    </html>
  );
}
