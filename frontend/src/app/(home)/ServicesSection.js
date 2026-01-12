"use client";

import Image from "next/image";
import { Ephesis } from "next/font/google";
import { Story_Script } from "next/font/google";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const storyScript = Story_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const menServices = [
  { name: "Haircut", image: "men-haircut.jpg" },
  { name: "Threading", image: "men-threading.jpg" },
  { name: "Waxing", image: "men-waxing.jpg" },
  { name: "Head Massage", image: "men-head-massage.jpg" },
  { name: "Hair Color", image: "men-hair-color.jpg" },
  { name: "Scrub", image: "men-scrub.jpg" },
  { name: "Face Mask", image: "men-face-mask.jpg" },
  { name: "Keratin", image: "men-keratin.jpg" },
  { name: "Hair Spa", image: "men-hair-spa.jpg" },
  { name: "Moustache Binding", image: "men-moustache-binding.jpg" },
  { name: "Facials", image: "men-facials.jpg" },
];

const womenServices = [
  { name: "Threading", image: "women-threading.jpg" },
  { name: "Tinting", image: "women-tinting.jpg" },
  { name: "Haircut", image: "women-haircut.jpg" },
  { name: "Highlights", image: "women-highlights.jpg" },
  { name: "Global Color", image: "women-global-color.jpg" },
  { name: "Botox", image: "women-botox.jpg" },
  { name: "Keratin", image: "women-keratin.jpg" },
  { name: "Kerasmooth", image: "women-kerasmooth.jpg" },
  { name: "Rebonding", image: "women-rebonding.jpg" },
  { name: "Smoothening", image: "women-smoothening.jpg" },
  { name: "Hair Spa Treatment", image: "women-hair-spa.jpg" },
];

function ServiceCard({ service, index }) {
  return (
    <>
      <style jsx>{`
        .service-card {
          position: relative;
          flex-shrink: 0;
          width: 280px;
          height: 420px;
          overflow: hidden;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover {
          transform: scale(1.03);
        }

        @media (prefers-reduced-motion: reduce) {
          .service-card {
            transition: none;
          }

          .service-card:hover {
            transform: none;
          }
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover .service-image {
          transform: scale(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          .service-image {
            transition: none;
          }

          .service-card:hover .service-image {
            transform: none;
          }
        }

        .service-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.75) 0%,
            rgba(0, 0, 0, 0.5) 40%,
            rgba(0, 0, 0, 0.25) 70%,
            rgba(0, 0, 0, 0) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 1.75rem 1.5rem;
          transition: height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: hidden;
          backdrop-filter: blur(1px);
        }

        .service-card:hover .service-overlay {
          height: 30%;
        }

        @media (prefers-reduced-motion: reduce) {
          .service-overlay {
            transition: none;
            height: 30%;
          }
        }

        .service-name {
          color: #f5f5f0;
          font-family: ${storyScript.style.fontFamily};
          font-size: 1.5rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s ease 0.15s, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s;
          line-height: 1.2;
        }

        .service-card:hover .service-name {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .service-name {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }

        .service-name-mobile {
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.75) 0%,
            rgba(0, 0, 0, 0.5) 40%,
            rgba(0, 0, 0, 0.25) 70%,
            rgba(0, 0, 0, 0) 100%
          );
          color: #f5f5f0;
          font-family: ${storyScript.style.fontFamily};
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          padding: 1.25rem 1rem;
          text-align: center;
          line-height: 1.2;
        }

        @media (min-width: 769px) {
          .service-name-mobile {
            display: none;
          }
        }
      `}</style>

      <div className="service-card">
        <Image
          src={`/${service.image}`}
          alt={service.name}
          fill
          className="service-image"
          sizes="280px"
        />
        <div className="service-overlay">
          <span className="service-name">{service.name}</span>
        </div>
        <span className="service-name-mobile">{service.name}</span>
      </div>
    </>
  );
}

function ServiceSubsection({ title, services }) {
  return (
    <>
      <style jsx>{`
        .subsection {
          margin-bottom: 4rem;
        }

        .subsection:last-child {
          margin-bottom: 0;
        }

        .subsection-title {
          font-family: ${ephesis.style.fontFamily};
          color: #d4af37;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
          text-align: left;
        }

        .services-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          padding-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .services-scroll::-webkit-scrollbar {
          display: none;
        }

        .services-scroll::after {
          content: "";
          flex-shrink: 0;
          width: 1px;
        }
      `}</style>

      <div className="subsection">
        <h3 className="subsection-title">{title}</h3>
        <div className="services-scroll">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default function ServicesSection() {
  return (
    <>
      <style jsx>{`
        .services-section {
          background: #0a0a0a;
          padding: 5rem 2rem;
          position: relative;
        }

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-family: ${ephesis.style.fontFamily};
          color: #f5f5f0;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          letter-spacing: 0.03em;
          text-align: center;
          margin-bottom: 4rem;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .services-section {
            padding: 4rem 1.5rem;
          }

          .section-title {
            margin-bottom: 3rem;
            font-size: clamp(2rem, 6vw, 2.5rem);
          }
        }
      `}</style>

      <section id="services" className="services-section">
        <div className="section-container">
          <h2 className="section-title">Signature Services</h2>

          <ServiceSubsection title="Men" services={menServices} />
          <ServiceSubsection title="Women" services={womenServices} />
        </div>
      </section>
    </>
  );
}
