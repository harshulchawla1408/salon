"use client";

import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

export default function ClientRootLayout({ children }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleBookNowClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthProvider>
      <Header onLoginClick={handleLoginClick} onBookNowClick={handleBookNowClick} />
      <main>{children}</main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </AuthProvider>
  );
}
