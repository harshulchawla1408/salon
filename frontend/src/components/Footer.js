"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ephesis } from "next/font/google";
import { Merienda } from "next/font/google";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const merienda = Merienda({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  ),
};

function FooterColumn({ title, children, index, isVisible }) {
  return (
    <>
      <style jsx>{`
        .footer-column {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: ${index * 0.1}s;
        }

        .footer-column.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-column {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }

        .column-title {
          font-family: ${merienda.style.fontFamily};
          color: #d4af37;
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .column-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .column-link {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 400;
          transition: color 0.3s ease, transform 0.2s ease;
          display: inline-block;
        }

        .column-link:hover {
          color: #d4af37;
          transform: translateX(4px);
        }

        .column-text {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.7;
          margin: 0;
        }

        @media (max-width: 768px) {
          .column-title {
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .column-link,
          .column-text {
            font-size: 0.9rem;
          }

          .column-content {
            gap: 0.625rem;
          }
        }
      `}</style>

      <div className={`footer-column ${isVisible ? "visible" : ""}`}>
        {title && <h3 className="column-title">{title}</h3>}
        <div className="column-content">{children}</div>
      </div>
    </>
  );
}

function SocialIcon({ icon, href, index, isVisible }) {
  return (
    <>
      <style jsx>{`
        .social-icon {
          width: 40px;
          height: 40px;
          color: #d4af37;
          opacity: 0;
          transform: translateY(10px) scale(0.9);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            color 0.3s ease, transform 0.3s ease;
          transition-delay: ${0.4 + index * 0.1}s;
          cursor: pointer;
        }

        .social-icons.visible .social-icon {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .social-icon:hover {
          color: #f4d03f;
          transform: translateY(-4px) scale(1.05);
          filter: drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3));
        }

        .social-icon svg {
          width: 100%;
          height: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
          .social-icon {
            transition: none;
            opacity: 1;
            transform: none;
          }

          .social-icon:hover {
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .social-icon {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="social-icon"
        aria-label={icon}
      >
        {socialIcons[icon]}
      </a>
    </>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx>{`
        .footer {
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
        }

        .footer-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .footer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.75) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          z-index: 1;
        }

        .footer-content {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
        }

        .footer-main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .brand-section .brand-name {
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 1rem;
          letter-spacing: 0.03em;
        }

        .brand-section .brand-tagline {
          font-family: ${merienda.style.fontFamily};
          color: #b8b8b8;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-bottom {
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          padding-top: 2rem;
          text-align: center;
        }

        .copyright {
          font-family: ${merienda.style.fontFamily};
          color: #b8b8b8;
          font-size: 0.875rem;
          font-weight: 400;
          margin: 0;
          letter-spacing: 0.02em;
        }

        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .footer-content {
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .brand-section .brand-name {
            font-size: 1.75rem;
          }

          .social-icons {
            gap: 0.875rem;
          }

          .footer-bottom {
            padding-top: 1.5rem;
          }
        }
      `}</style>

      <footer className="footer" ref={footerRef}>
        <Image
          src="/footer.jpg"
          alt="Footer background"
          fill
          className="footer-background"
          sizes="100vw"
          quality={85}
          priority={false}
        />
        <div className="footer-overlay" />

        <div className="footer-content">
          <div className="footer-main">
            <FooterColumn index={0} isVisible={isVisible}>
              <div className="brand-section">
                <h2 className="brand-name">Gabru Look Salon</h2>
                <p className="brand-tagline">
                  Precision Grooming. Personalised Luxury. On Your Time.
                </p>
                <div className={`social-icons ${isVisible ? "visible" : ""}`}>
                  <SocialIcon
                    icon="instagram"
                    href="https://instagram.com"
                    index={0}
                    isVisible={isVisible}
                  />
                  <SocialIcon
                    icon="facebook"
                    href="https://facebook.com"
                    index={1}
                    isVisible={isVisible}
                  />
                  <SocialIcon
                    icon="twitter"
                    href="https://twitter.com"
                    index={2}
                    isVisible={isVisible}
                  />
                  <SocialIcon
                    icon="whatsapp"
                    href="https://wa.me"
                    index={3}
                    isVisible={isVisible}
                  />
                </div>
              </div>
            </FooterColumn>

            <FooterColumn title="Quick Links" index={1} isVisible={isVisible}>
              <a href="#home" className="column-link">
                Home
              </a>
              <a href="#about" className="column-link">
                About Us
              </a>
              <a href="#services" className="column-link">
                Services
              </a>
              <a href="#shop" className="column-link">
                E-Shop
              </a>
              <a href="#contact" className="column-link">
                Contact
              </a>
            </FooterColumn>

            <FooterColumn title="Services" index={2} isVisible={isVisible}>
              <a href="#services" className="column-link">
                Men Services
              </a>
              <a href="#services" className="column-link">
                Women Services
              </a>
              <a href="#book" className="column-link">
                Book Appointment
              </a>
              <a href="#privacy" className="column-link">
                Privacy Policy
              </a>
              <a href="#terms" className="column-link">
                Terms & Conditions
              </a>
            </FooterColumn>

            <FooterColumn title="Contact" index={3} isVisible={isVisible}>
              <p className="column-text">
                123 Luxury Street<br />
                Melbourne, VIC 3000<br />
                Australia
              </p>
              <p className="column-text">
                <a href="tel:+61123456789" className="column-link" style={{ display: "inline" }}>
                  +61 123 456 789
                </a>
              </p>
              <p className="column-text">
                <a href="mailto:info@gabrulooksalon.com" className="column-link" style={{ display: "inline" }}>
                  info@gabrulooksalon.com
                </a>
              </p>
              <p className="column-text" style={{ marginTop: "0.5rem" }}>
                Mon - Sat: 9:00 AM - 8:00 PM<br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </FooterColumn>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              © {currentYear} Gabru Look Salon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
