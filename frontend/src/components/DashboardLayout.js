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

        if (userData.role !== requiredRole) {
          router.push("/");
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("Auth verification failed:", err);
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
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
