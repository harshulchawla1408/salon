"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Ephesis } from "next/font/google";
import api from "@/lib/api";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HomePage() {
  const overlayRef = useRef(null);
  const router = useRouter();

  const [lineIndex, setLineIndex] = useState(0);
  const [status, setStatus] = useState("Checking authentication...");

  const taglineLines = [
    "Precision Grooming,",
    "Personalised Luxury,",
    "On Your Time",
  ];

  /* ------------------ ANIMATION ------------------ */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setLineIndex(taglineLines.length);
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

      setLineIndex(Math.floor(eased * taglineLines.length));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setLineIndex(taglineLines.length);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  /* ------------------ AUTH CHECK ------------------ */
  useEffect(() => {
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

        router.replace(dashboardMap[role] || "/dashboard/user");
      } catch (err) {
        setStatus("Not logged in");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1 className={ephesis.className}>Urban Gabhru Salon</h1>
      <p>{status}</p>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <p>This page is used only to verify authentication & role-based routing.</p>

      <ul>
        <li>User → /dashboard/user</li>
        <li>Barber → /dashboard/barber</li>
        <li>Admin → /dashboard/admin</li>
        <li>Receptionist → /dashboard/receptionist</li>
      </ul>
    </div>
  );
}
