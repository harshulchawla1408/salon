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

// Premium SVG Icons
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const contactCards = [
  {
    icon: PhoneIcon,
    heading: "Call Us",
    content: "+61 460 309 333",
    link: "tel:+61460309333",
    type: "phone",
  },
  {
    icon: LocationIcon,
    heading: "Visit Us",
    content: "263 Heaths Rd, Werribee VIC 3030, Australia",
    link: "https://maps.app.goo.gl/KDeQfuknDNsEj3Ty5",
    type: "location",
    buttonText: "View on Map",
  },
  {
    icon: MailIcon,
    heading: "Email Us",
    content: "contact@gabrulooks.com",
    link: "mailto:contact@gabrulooks.com",
    type: "email",
  },
];

export default function ContactUsPage() {
  const cardsRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setCardsVisible(true);
      return;
    }

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCardsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardsRef.current) {
      cardsObserver.observe(cardsRef.current);
    }

    return () => {
      if (cardsRef.current) {
        cardsObserver.unobserve(cardsRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .contact-us-page {
          width: 100%;
          min-height: 100vh;
          background: #0a0a0a;
          color: #f5f5f0;
        }

        /* Section 1: Hero / Top Image */
        .hero-section {
          position: relative;
          width: 100%;
          height: 50vh;
          min-height: 400px;
          max-height: 600px;
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        /* Section 2: Contact Cards */
        .contact-cards-section {
          padding: 6rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .contact-card {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 3rem 2.5rem;
          text-align: center;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(212, 175, 55, 0.05) inset;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .contact-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.3),
            transparent
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .contact-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .contact-card:nth-child(1) {
          transition-delay: 0.1s;
        }
        .contact-card:nth-child(2) {
          transition-delay: 0.2s;
        }
        .contact-card:nth-child(3) {
          transition-delay: 0.3s;
        }

        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(212, 175, 55, 0.25),
            0 8px 24px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(212, 175, 55, 0.15) inset;
          border-color: rgba(212, 175, 55, 0.4);
        }

        .contact-card:hover::before {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-card {
            opacity: 1;
            transform: none;
            transition: box-shadow 0.4s ease, border-color 0.4s ease;
          }

          .contact-card:hover {
            transform: none;
          }
        }

        .card-icon {
          width: 64px;
          height: 64px;
          color: #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.2));
        }

        .card-icon svg {
          width: 100%;
          height: 100%;
        }

        .card-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          margin: 0;
        }

        .card-content {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 1.125rem;
          line-height: 1.7;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin: 0;
        }

        .card-link {
          color: #d4af37;
          text-decoration: none;
          transition: color 0.3s ease, opacity 0.3s ease;
          display: inline-block;
        }

        .card-link:hover {
          color: #f4d03f;
          opacity: 0.9;
        }

        .card-button {
          margin-top: 1rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-family: ${merienda.style.fontFamily};
          font-size: 0.95rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-button:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.5);
          color: #f4d03f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .card-button:hover {
            transform: none;
          }
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .cards-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .contact-card:nth-child(3) {
            grid-column: 1 / -1;
            max-width: 600px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 40vh;
            min-height: 300px;
          }

          .contact-cards-section {
            padding: 4rem 1.5rem;
          }

          .cards-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .contact-card:nth-child(3) {
            grid-column: 1;
            max-width: 100%;
          }

          .contact-card {
            padding: 2.5rem 2rem;
          }

          .card-icon {
            width: 56px;
            height: 56px;
          }

          .card-heading {
            font-size: 1.75rem;
          }

          .card-content {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 35vh;
            min-height: 250px;
          }

          .contact-cards-section {
            padding: 3rem 1.25rem;
          }

          .contact-card {
            padding: 2rem 1.5rem;
          }

          .card-heading {
            font-size: 1.5rem;
          }

          .card-content {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="contact-us-page">
        {/* Section 1: Hero / Top Image */}
        <section className="hero-section">
          <Image
            src="/contact.jpg"
            alt="Contact Us"
            fill
            priority
            className="hero-image"
            sizes="100vw"
          />
          <div className="hero-overlay" />
        </section>

        {/* Section 2: Contact Cards */}
        <section className="contact-cards-section" ref={cardsRef}>
          <div className="cards-container">
            {contactCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={index}
                  className={`contact-card ${cardsVisible ? "visible" : ""}`}
                >
                  <div className="card-icon">
                    <IconComponent />
                  </div>
                  <h2 className="card-heading">{card.heading}</h2>
                  {card.type === "location" ? (
                    <>
                      <p className="card-content">{card.content}</p>
                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-button"
                      >
                        {card.buttonText}
                      </a>
                    </>
                  ) : (
                    <a href={card.link} className="card-content card-link">
                      {card.content}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
