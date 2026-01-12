"use client";

import { useEffect, useRef, useState } from "react";
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

const iconComponents = {
  star: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  diamond: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M6 3l6 18 6-18" />
      <path d="M2 9h20" />
    </svg>
  ),
  crown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M8 14l-3-3" />
      <path d="M16 14l3-3" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  scissors: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88" />
      <path d="M14.47 14.48L20 20" />
      <path d="M8.12 8.12L12 12" />
    </svg>
  ),
  leaf: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
};

const whyChooseUsPoints = [
  {
    title: "Expert Professionals",
    description: "Our team consists of highly skilled and certified stylists with years of experience.",
    icon: "star",
  },
  {
    title: "Premium Products",
    description: "We use only the finest quality products from renowned international brands.",
    icon: "diamond",
  },
  {
    title: "Personalized Experience",
    description: "Every service is tailored to your unique style, preferences, and needs.",
    icon: "crown",
  },
  {
    title: "Hygienic & Safe",
    description: "We maintain the highest standards of cleanliness and safety protocols.",
    icon: "shield",
  },
  {
    title: "Modern Techniques",
    description: "Stay ahead with the latest trends and cutting-edge grooming technologies.",
    icon: "scissors",
  },
  {
    title: "Relaxing Ambience",
    description: "Unwind in our luxurious, calming environment designed for your comfort.",
    icon: "leaf",
  },
];

function WhyChooseCard({ point, index, isVisible }) {
  return (
    <>
      <style jsx>{`
        .why-choose-card {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 2.25rem 2rem;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
          transition-delay: ${index * 0.12}s;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(212, 175, 55, 0.05) inset;
          position: relative;
          overflow: hidden;
        }

        .why-choose-card::before {
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

        .why-choose-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .why-choose-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.25),
            0 8px 24px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(212, 175, 55, 0.15) inset;
          border-color: rgba(212, 175, 55, 0.4);
        }

        .why-choose-card:hover::before {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .why-choose-card {
            transition: none;
            opacity: 1;
            transform: none;
          }

          .why-choose-card:hover {
            transform: none;
          }
        }

        .card-icon {
          width: 48px;
          height: 48px;
          color: #d4af37;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 0.2s,
            transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
          transition-delay: ${index * 0.12 + 0.2}s;
        }

        .why-choose-card.visible .card-icon {
          opacity: 1;
          transform: translateY(0);
        }

        .card-icon svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.15));
        }

        @media (prefers-reduced-motion: reduce) {
          .card-icon {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }

        .card-title {
          font-family: ${merienda.style.fontFamily};
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.875rem;
          letter-spacing: 0.03em;
          line-height: 1.3;
        }

        .card-description {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 1rem;
          line-height: 1.7;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        @media (max-width: 768px) {
          .why-choose-card {
            padding: 1.75rem 1.5rem;
          }

          .card-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 1.3rem;
          }

          .card-description {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className={`why-choose-card ${isVisible ? "visible" : ""}`}>
        <div className="card-icon">
          {iconComponents[point.icon]}
        </div>
        <h3 className="card-title">{point.title}</h3>
        <p className="card-description">{point.description}</p>
      </div>
    </>
  );
}

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
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
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .why-choose-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 5rem 2rem;
          min-height: auto;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.65) 0%,
            rgba(0, 0, 0, 0.55) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          z-index: 1;
        }

        .section-content {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .section-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          text-align: center;
          margin-bottom: 3.5rem;
          line-height: 1.2;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.75rem;
          }
        }

        @media (max-width: 768px) {
          .why-choose-section {
            padding: 4rem 1.5rem;
          }

          .section-heading {
            margin-bottom: 2.5rem;
            font-size: clamp(2.5rem, 7vw, 3.5rem);
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .why-choose-section {
            padding: 3.5rem 1.25rem;
          }

          .cards-grid {
            gap: 1.25rem;
          }
        }
      `}</style>

      <section id="why-choose-us" className="why-choose-section" ref={sectionRef}>
        <video
          className="video-background"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/WhyChooseUs_VIdeo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="video-overlay" />

        <div className="section-content">
          <h2 className="section-heading">Why Choose Us</h2>

          <div className="cards-grid">
            {whyChooseUsPoints.map((point, index) => (
              <WhyChooseCard
                key={index}
                point={point}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
