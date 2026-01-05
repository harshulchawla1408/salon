"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking authentication...");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/auth/me");

        const role = res.data.role;
        setStatus(`Logged in as ${role}`);

        if (role === "admin") router.push("/dashboard/admin");
        else if (role === "barber") router.push("/dashboard/barber");
        else router.push("/dashboard/user");
      } catch (err) {
        setStatus("Not logged in");
      }
    }

    checkAuth();
  }, [router]);

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
