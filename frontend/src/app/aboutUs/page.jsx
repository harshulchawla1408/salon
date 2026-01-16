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

// Team members data
const teamMembers = [
  {
    name: "Sarah Mitchell",
    role: "Senior Hair Stylist",
    description: "Specializing in precision cuts and modern coloring techniques with over 8 years of experience.",
    image: "barber1.png",
  },
  {
    name: "James Anderson",
    role: "Color Specialist",
    description: "Expert in balayage, highlights, and custom color formulations for both men and women.",
    image: "barber2.png",
  },
  {
    name: "Emily Chen",
    role: "Grooming Expert",
    description: "Master of classic and contemporary styles, known for attention to detail and client satisfaction.",
    image: "barber3.png",
  },
  {
    name: "Michael Rodriguez",
    role: "Hair Treatment Specialist",
    description: "Dedicated to hair health and restoration using premium products and advanced treatment methods.",
    image: "barber4.png",
  },
];

export default function AboutUsPage() {
  const visionRef = useRef(null);
  const teamRef = useRef(null);
  const galleryRef = useRef(null);
  const [visionVisible, setVisionVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setVisionVisible(true);
      setTeamVisible(true);
      return;
    }

    // Vision section observer
    const visionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisionVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Team section observer
    const teamObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTeamVisible(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (visionRef.current) {
      visionObserver.observe(visionRef.current);
    }

    if (teamRef.current) {
      teamObserver.observe(teamRef.current);
    }

    // Gallery section observer
    const galleryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setGalleryVisible(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (galleryRef.current) {
      galleryObserver.observe(galleryRef.current);
    }

    return () => {
      if (visionRef.current) {
        visionObserver.unobserve(visionRef.current);
      }
      if (teamRef.current) {
        teamObserver.unobserve(teamRef.current);
      }
      if (galleryRef.current) {
        galleryObserver.unobserve(galleryRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .about-us-page {
          width: 100%;
          min-height: 100vh;
          background: #0a0a0a;
          color: #f5f5f0;
        }

        /* Section 1: Hero / Main Gate Image */
        .hero-section {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          max-height: 800px;
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

        /* Section 2: About Us (Owner + Text) */
        .about-section {
          padding: 6rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .about-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .owner-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .owner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .owner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .owner-name {
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: 2.5rem;
          text-align: center;
          transform: translateY(10px);
          transition: transform 0.4s ease;
        }

        .owner-image-wrapper:hover .owner-overlay {
          opacity: 1;
        }

        .owner-image-wrapper:hover .owner-name {
          transform: translateY(0);
        }

        .owner-image-wrapper:hover .owner-image {
          transform: scale(1.05);
        }

        .owner-name-mobile {
          display: none;
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: 2rem;
          text-align: center;
          margin-top: 1.5rem;
        }

        .about-text {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .about-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          margin-bottom: 1rem;
        }

        .about-content {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 1.125rem;
          line-height: 1.8;
          letter-spacing: 0.01em;
          font-weight: 400;
        }

        /* Section 3: Our Vision */
        .vision-section {
          padding: 6rem 2rem;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 1) 0%,
            rgba(15, 15, 15, 1) 100%
          );
          position: relative;
        }

        .vision-container {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .vision-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          margin-bottom: 2.5rem;
        }

        .vision-content {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 1.25rem;
          line-height: 1.9;
          letter-spacing: 0.01em;
          font-weight: 400;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .vision-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .vision-content {
            opacity: 1;
            transform: none;
          }
        }

        /* Section 4: Meet Our Team */
        .team-section {
          padding: 6rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .team-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          text-align: center;
          margin-bottom: 4rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .team-card {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          position: relative;
        }

        .team-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .team-card:nth-child(1) {
          transition-delay: 0.1s;
        }
        .team-card:nth-child(2) {
          transition-delay: 0.2s;
        }
        .team-card:nth-child(3) {
          transition-delay: 0.3s;
        }
        .team-card:nth-child(4) {
          transition-delay: 0.4s;
        }

        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(212, 175, 55, 0.2),
            0 8px 24px rgba(0, 0, 0, 0.5);
          border-color: rgba(212, 175, 55, 0.4);
        }

        @media (prefers-reduced-motion: reduce) {
          .team-card {
            opacity: 1;
            transform: none;
          }

          .team-card:hover {
            transform: none;
          }
        }

        .team-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .team-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .team-card:hover .team-image {
          transform: scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .team-image {
            transition: none;
          }

          .team-card:hover .team-image {
            transform: none;
          }
        }

        .team-info {
          padding: 2rem 1.5rem;
        }

        .team-name {
          font-family: ${merienda.style.fontFamily};
          color: #d4af37;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
        }

        .team-role {
          font-family: ${merienda.style.fontFamily};
          color: #b8b8b8;
          font-size: 0.95rem;
          font-weight: 400;
          margin-bottom: 1rem;
          letter-spacing: 0.01em;
        }

        .team-description {
          font-family: ${merienda.style.fontFamily};
          color: #e5e5e5;
          font-size: 0.95rem;
          line-height: 1.6;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        /* Section 5: Video Section */
        .video-section {
          padding: 6rem 2rem;
          background: linear-gradient(
            to bottom,
            rgba(15, 15, 15, 1) 0%,
            rgba(10, 10, 10, 1) 100%
          );
        }

        .video-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .video-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          text-align: center;
          margin-bottom: 3rem;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay-cinematic {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.2) 100%
          );
          pointer-events: none;
        }

        /* Section 6: Happy Customers Gallery */
        .gallery-section {
          padding: 6rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 10, 1) 0%,
            rgba(15, 15, 15, 1) 100%
          );
        }

        .gallery-heading {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          text-align: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-heading.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-heading {
            opacity: 1;
            transform: none;
          }
        }

        .gallery-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 3rem;
          align-items: center;
        }

        .gallery-side {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.4s ease,
            opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-item.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .gallery-item:nth-child(1) {
          transition-delay: 0.1s;
        }
        .gallery-item:nth-child(2) {
          transition-delay: 0.2s;
        }
        .gallery-item:nth-child(3) {
          transition-delay: 0.3s;
        }
        .gallery-item:nth-child(4) {
          transition-delay: 0.4s;
        }

        .gallery-item:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.25),
            0 8px 24px rgba(0, 0, 0, 0.6);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-item {
            opacity: 1;
            transform: none;
            transition: box-shadow 0.4s ease;
          }

          .gallery-item:hover {
            transform: none;
          }
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-image {
            transition: none;
          }

          .gallery-item:hover .gallery-image {
            transform: none;
          }
        }

        .gallery-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s,
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s;
        }

        .gallery-center.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-center {
            opacity: 1;
            transform: none;
          }
        }

        .qr-code-wrapper {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(212, 175, 55, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.4);
          background: #ffffff;
          padding: 1rem;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .qr-code-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.3),
            0 8px 24px rgba(0, 0, 0, 0.5);
        }

        @media (prefers-reduced-motion: reduce) {
          .qr-code-wrapper {
            transition: none;
          }

          .qr-code-wrapper:hover {
            transform: none;
          }
        }

        .qr-code-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .gallery-center-text {
          font-family: ${merienda.style.fontFamily};
          color: #d4af37;
          font-size: 1.1rem;
          font-weight: 400;
          text-align: center;
          letter-spacing: 0.02em;
          line-height: 1.6;
          max-width: 250px;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .about-container {
            gap: 3rem;
          }

          .team-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .gallery-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .gallery-side {
            grid-template-columns: repeat(4, 1fr);
          }

          .gallery-center {
            order: -1;
          }

          .qr-code-wrapper {
            width: 200px;
            height: 200px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 50vh;
            min-height: 400px;
          }

          .about-section {
            padding: 4rem 1.5rem;
          }

          .about-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .owner-overlay {
            display: none;
          }

          .owner-name-mobile {
            display: block;
          }

          .vision-section {
            padding: 4rem 1.5rem;
          }

          .team-section {
            padding: 4rem 1.5rem;
          }

          .team-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .video-section {
            padding: 4rem 1.5rem;
          }

          .gallery-section {
            padding: 4rem 1.5rem;
          }

          .gallery-heading {
            margin-bottom: 3rem;
          }

          .gallery-side {
            grid-template-columns: repeat(2, 1fr);
          }

          .qr-code-wrapper {
            width: 180px;
            height: 180px;
          }

          .gallery-center-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .about-section,
          .vision-section,
          .team-section,
          .video-section,
          .gallery-section {
            padding: 3rem 1.25rem;
          }

          .gallery-heading {
            margin-bottom: 2.5rem;
          }

          .gallery-side {
            gap: 1rem;
          }

          .qr-code-wrapper {
            width: 160px;
            height: 160px;
            padding: 0.75rem;
          }

          .gallery-center-text {
            font-size: 0.95rem;
            max-width: 200px;
          }
        }
      `}</style>

      <div className="about-us-page">
        {/* Section 1: Hero / Main Gate Image */}
        <section className="hero-section">
          <Image
            src="/aboutus.jpg"
            alt="Salon Entrance"
            fill
            priority
            className="hero-image"
            sizes="100vw"
          />
          <div className="hero-overlay" />
        </section>

        {/* Section 2: About Us (Owner + Text) */}
        <section className="about-section">
          <div className="about-container">
            <div className="owner-image-wrapper">
              <Image
                src="/owner.png"
                alt="Salon Owner"
                fill
                className="owner-image"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="owner-overlay">
                <h3 className="owner-name">Owner Name</h3>
              </div>
            </div>
            <div className="about-text">
              <h2 className="about-heading">About Us</h2>
              <p className="about-content">
                At Gabru Looks Salon, we believe beauty is an art form, and
                every person is a unique canvas waiting to be transformed. Our
                salon is founded on the principle of delivering deeply
                personalized and luxurious experiences that go beyond the
                ordinary.
              </p>
              <p className="about-content">
                With a team of skilled and passionate stylists, we help you
                express your individual style through precision haircuts,
                advanced coloring techniques, nourishing treatments, and more.
                By combining modern techniques with premium-quality products, we
                ensure your hair not only looks stunning but feels healthy,
                confident, and vibrant.
              </p>
            </div>
          </div>
          <h3 className="owner-name-mobile">Owner Name</h3>
        </section>

        {/* Section 3: Our Vision */}
        <section className="vision-section" ref={visionRef}>
          <div className="vision-container">
            <h2 className="vision-heading">Our Vision</h2>
            <p
              className={`vision-content ${visionVisible ? "visible" : ""}`}
            >
              Our vision is to create a sanctuary where creativity, expertise,
              and genuine care converge. Our talented professionals are
              committed to enhancing your individuality through modern
              techniques, innovative treatments, and high-quality products.
              Every service is crafted to elevate not just your appearance, but
              your confidence and self-expression.
            </p>
          </div>
        </section>

        {/* Section 4: Meet Our Team */}
        <section className="team-section" ref={teamRef}>
          <h2 className="team-heading">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`team-card ${teamVisible ? "visible" : ""}`}
              >
                <div className="team-image-wrapper">
                  <Image
                    src={`/${member.image}`}
                    alt={member.name}
                    fill
                    className="team-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Video Section */}
        <section className="video-section">
          <div className="video-container">
            <h2 className="video-heading">Step Inside Our World of Luxury</h2>
            <div className="video-wrapper">
              <video
                className="video-element"
                controls
                preload="metadata"
                poster="/aboutus.jpg"
              >
                <source src="/salon.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay-cinematic" />
            </div>
          </div>
        </section>

        {/* Section 6: Happy Customers Gallery */}
        <section className="gallery-section" ref={galleryRef}>
          <h2
            className={`gallery-heading ${galleryVisible ? "visible" : ""}`}
          >
            Happy Customers Gallary
          </h2>
          <div className="gallery-container">
            <div className="gallery-side">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`gallery-item ${galleryVisible ? "visible" : ""}`}
                >
                  <Image
                    src={`/gallery${num}.jpg`}
                    alt={`Happy Customer ${num}`}
                    fill
                    className="gallery-image"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>

            <div
              className={`gallery-center ${galleryVisible ? "visible" : ""}`}
            >
              <div className="qr-code-wrapper">
                <Image
                  src="/QR.jpeg"
                  alt="Instagram QR Code"
                  fill
                  className="qr-code-image"
                  sizes="220px"
                />
              </div>
              <p className="gallery-center-text">
                Scan here to see our work on Instagram
              </p>
            </div>

            <div className="gallery-side">
              {[5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className={`gallery-item ${galleryVisible ? "visible" : ""}`}
                >
                  <Image
                    src={`/gallery${num}.jpg`}
                    alt={`Happy Customer ${num}`}
                    fill
                    className="gallery-image"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
