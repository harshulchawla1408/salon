"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (user?.role) {
      const dashboardMap = {
        admin: "/dashboard/admin",
        barber: "/dashboard/barber",
        user: "/dashboard/user",
        receptionist: "/dashboard/receptionist",
      };

      const dashboardPath = dashboardMap[user.role] || "/dashboard/user";
      router.replace(dashboardPath);
    } else {
      // No user, redirect to home
      router.replace("/");
    }
    setIsRedirecting(false);
  }, [user, loading, router]);

  // User should never see this UI - redirect happens immediately
  // Show minimal loading state only if redirect is delayed
  if (isRedirecting) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div
          className="auth-spinner"
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(212, 175, 55, 0.3)",
            borderTopColor: "#d4af37",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  return null;
}
