"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookingFlow from "@/components/BookingFlow";
import Link from "next/link";

export default function Header({ onLoginClick, onBookNowClick }) {
  const router = useRouter();
  const { isAuthenticated, role, logout } = useAuth();
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const handleDashboardClick = () => {
    const dashboardMap = {
      admin: "/dashboard/admin",
      barber: "/dashboard/barber",
      user: "/dashboard/user",
      receptionist: "/dashboard/receptionist",
    };
    router.push(dashboardMap[role] || "/dashboard/user");
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleBookNow = () => {
    if (isAuthenticated) {
      // If logged in, show booking flow
      setShowBookingFlow(true);
    } else {
      // If not logged in, open login modal
      onBookNowClick();
    }
  };

  return (
    <>
      <header className="luxury-header">
        <div className="header-left">
          <button className="book-button" type="button" onClick={handleBookNow}>
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
         <Link href="/aboutUs">About Us</Link>
          <a href="#services">Services</a>
          <a href="#shop">E-Shop</a>
          <Link href="/contactUs">Contact</Link>
        </nav>
        {isAuthenticated ? (
          <>
            <button
              className="book-button"
              type="button"
              onClick={handleDashboardClick}
              style={{ marginLeft: "1.5rem" }}
            >
              Dashboard
            </button>
            <button
              className="book-button"
              type="button"
              onClick={handleLogout}
              style={{ marginLeft: "0.75rem" }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="book-button"
            type="button"
            onClick={onLoginClick}
            style={{ marginLeft: "1.5rem" }}
          >
            Login
          </button>
        )}
      </div>
    </header>

    {showBookingFlow && (
      <BookingFlow
        onClose={() => setShowBookingFlow(false)}
        onSuccess={() => {
          setShowBookingFlow(false);
          // Optionally redirect to user dashboard
          if (role === "user") {
            router.push("/dashboard/user");
          }
        }}
      />
    )}
    </>
  );
}
