"use client";

import Image from "next/image";

export default function Header({ onLoginClick, onBookNowClick }) {
  return (
    <header className="luxury-header">
      <div className="header-left">
        <button className="book-button" type="button" onClick={onBookNowClick}>
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
        <button className="book-button" type="button" onClick={onLoginClick} style={{ marginLeft: "1.5rem" }}>
          Login
        </button>
      </div>
    </header>
  );
}
