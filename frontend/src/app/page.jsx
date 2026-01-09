"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ephesis } from "next/font/google";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HomePage() {
  const overlayRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  const taglineLines = [
    "Precision Grooming,",
    "Personalised Luxury,",
    "On Your Time",
  ];

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setAnimationStarted(true);
      setLineIndex(taglineLines.length);
      return;
    }

    const duration = 1750; // ~1.75 seconds
    const start = performance.now();
    setAnimationStarted(true);

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      // Smooth easing function for premium feel
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (overlayRef.current) {
        // Overlay slides from right (100%) to final position (0%)
        // Starts off-screen right, slides in and stops at final position
        const translateX = 100 - eased * 100;
        overlayRef.current.style.transform = `translateX(${translateX}%)`;
      }

      // Tagline slides in automatically with overlay-container (parent element)

      // Animate lines appearing progressively
      const linesToShow = Math.floor(eased * taglineLines.length);
      setLineIndex(linesToShow);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setLineIndex(taglineLines.length);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <>
      <style jsx>{`
        .hero {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #0a0a0a;
        }

        .bg-image {
          object-fit: cover;
          object-position: center;
          z-index: 1;
        }

        .overlay-container {
          position: absolute;
          top: 0;
          right: 0;
          width: 60%;
          height: 100%;
          z-index: 2;
          will-change: transform;
          transform: translateX(100%);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 3rem;
          padding-right: 3rem;
        }

        .overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 1.5) 0%,    /* extreme right - darkest */
    rgba(0, 0, 0, 1.5) 15%,
    rgba(0, 0, 0, 1) 30%,
    rgba(0, 0, 0, 1) 45%,
    rgba(0, 0, 0, 0.9) 55%,
    rgba(0, 0, 0, 0.4) 65%      /* center - fully transparent */
  );
  z-index: 2;
  pointer-events: none;
}


        .tagline-container {
          position: relative;
          z-index: 3;
        }

        .tagline {
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.02em;
          line-height: 1.4;
          text-align: left;
          margin: 0;
        }

        .tagline-line {
          display: block;
          opacity: 0;
          transition: opacity 0.5s ease-out 0.2s;
        }

        .tagline-line.visible {
          opacity: 1;
        }


        @media (min-width: 768px) {
          .overlay-container {
            width: 55%;
            padding-left: 4rem;
            padding-right: 4rem;
          }

          .tagline {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
          }
        }

        @media (min-width: 1024px) {
          .overlay-container {
            width: 50%;
            padding-left: 5rem;
            padding-right: 5rem;
          }
        }

        @media (max-width: 640px) {
          .overlay-container {
            width: 75%;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .overlay-container {
            transform: translateX(0) !important;
          }

          .tagline-line {
            opacity: 1 !important;
            transition: none;
          }
        }
      `}</style>

      <section className="hero" aria-label="Hero section">
        {/* Hero background image */}
        <Image
          src="/hero1.png"
          alt="Luxury salon interior"
          fill
          priority
          className="bg-image"
          sizes="100vw"
          quality={90}
        />

        {/* Overlay container with gradient - slides from right and stays visible */}
        <div ref={overlayRef} className="overlay-container">
          <div className="overlay" />
          {/* Tagline positioned on overlay */}
          <div className="tagline-container">
            <h1 className="tagline">
              {taglineLines.map((line, idx) => (
                <span
                  key={idx}
                  className={`tagline-line ${idx < lineIndex ? "visible" : ""}`}
                >
                  {line}
                  {idx < taglineLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
        </div>

      </section>
    </>
  );
}
