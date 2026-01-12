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

const testimonials = [
  {
    text: "Absolutely transformed my look! The team here understands exactly what you need and delivers beyond expectations. Truly a premium experience.",
    name: "Sarah Mitchell",
  },
  {
    text: "The attention to detail and personalized service is unmatched. Every visit feels like a luxury retreat. Highly recommend their hair spa treatments.",
    name: "James Anderson",
  },
  {
    text: "Professional, elegant, and the results speak for themselves. The ambiance alone makes it worth visiting. I've found my go-to salon.",
    name: "Emma Rodriguez",
  },
  {
    text: "From consultation to finish, everything was perfect. The stylists are true artists who truly care about your vision. Outstanding service!",
    name: "Michael Chen",
  },
];

function TestimonialCard({ testimonial, index, isVisible }) {
  return (
    <>
      <style jsx>{`
        .testimonial-card {
          background: rgba(15, 15, 15, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 0 0 16px 16px;
          padding: 2rem 1.75rem 1.75rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.3s ease,
            transform 0.3s ease;
          transition-delay: ${index * 0.15}s;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .testimonial-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.15),
            0 4px 20px rgba(0, 0, 0, 0.4);
          border-color: rgba(212, 175, 55, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-card {
            transition: none;
            opacity: 1;
            transform: none;
          }

          .testimonial-card:hover {
            transform: none;
          }
        }

        .quote-icon {
          width: 32px;
          height: 32px;
          color: #d4af37;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .quote-icon svg {
          width: 100%;
          height: 100%;
        }

        .testimonial-text {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 0.95rem;
          line-height: 1.8;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin-bottom: 1.5rem;
        }

        .testimonial-name {
          font-family: ${merienda.style.fontFamily};
          color: #d4af37;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-align: right;
        }

        @media (max-width: 768px) {
          .testimonial-card {
            padding: 1.75rem 1.5rem 1.5rem;
          }

          .testimonial-text {
            font-size: 0.9rem;
            margin-bottom: 1.25rem;
          }

          .testimonial-name {
            font-size: 0.95rem;
          }

          .quote-icon {
            width: 28px;
            height: 28px;
            margin-bottom: 0.875rem;
          }
        }
      `}</style>

      <div className={`testimonial-card ${isVisible ? "visible" : ""}`}>
        <div className="quote-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </div>
        <p className="testimonial-text">"{testimonial.text}"</p>
        <div className="testimonial-name">— {testimonial.name}</div>
      </div>
    </>
  );
}

export default function TestimonialsSection() {
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
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
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
        .testimonials-section {
          background: #0a0a0a;
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
        }

        .testimonials-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .testimonials-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
          min-height: 600px;
        }

        .image-column {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 600px;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 1s ease, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .testimonials-section.visible .image-wrapper {
          opacity: 1;
          transform: translateX(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .image-wrapper {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }

        .section-image {
          object-fit: cover;
          object-position: center;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.5) 100%
          );
          z-index: 1;
        }

        .image-title {
          position: absolute;
          bottom: 3rem;
          left: 2rem;
          right: 2rem;
          z-index: 2;
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          line-height: 1.2;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }

        .testimonials-column {
          background: rgba(10, 10, 10, 0.95);
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }

        @media (max-width: 1024px) {
          .testimonials-layout {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .image-wrapper {
            min-height: 400px;
          }

          .testimonials-column {
            padding: 2.5rem 2rem;
          }

          .image-title {
            bottom: 2rem;
            left: 1.5rem;
            right: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .testimonials-section {
            padding: 4rem 0;
          }

          .testimonials-container {
            padding: 0 1.5rem;
          }

          .image-wrapper {
            min-height: 350px;
          }

          .testimonials-column {
            padding: 2rem 1.5rem;
            gap: 1.25rem;
          }

          .image-title {
            font-size: clamp(2rem, 6vw, 2.5rem);
            bottom: 1.5rem;
            left: 1rem;
            right: 1rem;
          }
        }
      `}</style>

      <section
        id="testimonials"
        className={`testimonials-section ${isVisible ? "visible" : ""}`}
        ref={sectionRef}
      >
        <div className="testimonials-container">
          <div className="testimonials-layout">
            <div className="image-column">
              <div className="image-wrapper">
                <Image
                  src="/testrimonial.jpg"
                  alt="Luxury salon client experience"
                  fill
                  className="section-image"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                  priority
                />
                <div className="image-overlay" />
                <h2 className="image-title">Client Testimonials</h2>
              </div>
            </div>

            <div className="testimonials-column">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
