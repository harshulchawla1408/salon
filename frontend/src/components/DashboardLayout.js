"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DashboardLayout({ children, requiredRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get("/auth/me");
        const userData = res.data;

        // Check if user has required role
        if (userData.role !== requiredRole) {
          // Redirect to correct dashboard based on role
          const dashboardMap = {
            admin: "/dashboard/admin",
            barber: "/dashboard/barber",
            user: "/dashboard/user",
            receptionist: "/dashboard/receptionist",
          };
          router.push(dashboardMap[userData.role] || "/dashboard/user");
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("Auth verification failed:", err);
        sessionStorage.removeItem("fbToken");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold capitalize">
            {requiredRole} Dashboard
          </h1>
          <p className="text-sm text-gray-500">{user.phone || user.email || "N/A"}</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
