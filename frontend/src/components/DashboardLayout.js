"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children, requiredRole }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push("/");
      return;
    }

    // Redirect if role mismatch
    if (!loading && user && user.role !== requiredRole) {
      const dashboardMap = {
        admin: "/dashboard/admin",
        barber: "/dashboard/barber",
        user: "/dashboard/user",
        receptionist: "/dashboard/receptionist",
      };
      router.push(dashboardMap[user.role] || "/dashboard/user");
      return;
    }
  }, [user, loading, isAuthenticated, requiredRole, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
