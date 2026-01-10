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
    async function checkAuth() {
      try {
        const res = await api.get("/auth/me");

        const role = res.data.role;
        setStatus(`Logged in as ${role}`);

        const dashboardMap = {
          admin: "/dashboard/admin",
          barber: "/dashboard/barber",
          user: "/dashboard/user",
          receptionist: "/dashboard/receptionist",
        };

        router.push(dashboardMap[role] || "/dashboard/user");
      } catch (err) {
        setStatus("Not logged in");
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div>
      <h1>Urban Gabhru Salon</h1>
      <p>{status}</p>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <p>
        This page is used only to verify authentication & role-based routing.
      </p>

      <ul>
        <li>User → /dashboard/user</li>
        <li>Barber → /dashboard/barber</li>
        <li>Admin → /dashboard/admin</li>
      </ul>
    </div>
  );
}
