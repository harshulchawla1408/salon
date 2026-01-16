"use client";

import { useEffect, useRef, useState } from "react";
import { Ephesis } from "next/font/google";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HeroSection() {
  const overlayRef = useRef(null);
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
      setLineIndex(taglineLines.length);
      if (overlayRef.current) {
        overlayRef.current.style.transform = "translateX(0%)";
      }
      return;
    }

    const duration = 1750;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (overlayRef.current) {
        const translateX = 100 - eased * 100;
        overlayRef.current.style.transform = `translateX(${translateX}%)`;
      }

      const currentLineIndex = Math.floor(eased * taglineLines.length);
      setLineIndex(currentLineIndex);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setLineIndex(taglineLines.length);
        if (overlayRef.current) {
          overlayRef.current.style.transform = "translateX(0%)";
        }
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.65),
            rgba(0, 0, 0, 0.75)
          ),
          url("/hero1.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* subtle moving dark overlay (luxury depth) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.3), rgba(0,0,0,0.85))",
          zIndex: 0,
        }}
      />

      {/* Sliding overlay that covers right half of hero section */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(to left, rgba(10,10,10,0.85) 0%, rgba(26,26,26,0.6) 30%, rgba(40,40,40,0.3) 60%, transparent 100%)",
          transform: "translateX(100%)",
          willChange: "transform",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1
          className={ephesis.className}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: "#d4af37",
            margin: 0,
            fontWeight: 400,
            letterSpacing: "0.02em",
            textShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          Gabru Look Salon
        </h1>

        <div
          style={{
            position: "relative",
            marginTop: "1.5rem",
            minHeight: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              color: "#ffffff",
              fontWeight: 300,
              letterSpacing: "0.05em",
              textShadow: "0 6px 25px rgba(0,0,0,0.7)",
            }}
          >
            {taglineLines.slice(0, lineIndex).map((line, idx) => (
              <div key={idx} style={{ margin: "0.5rem 0" }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
