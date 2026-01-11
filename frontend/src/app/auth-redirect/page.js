"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AuthRedirectPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        const res = await api.get("/auth/me");
        const role = res.data?.role;

        if (!role) {
          throw new Error("No role found");
        }

        const dashboardMap = {
          admin: "/dashboard/admin",
          barber: "/dashboard/barber",
          user: "/dashboard/user",
          receptionist: "/dashboard/receptionist",
        };

        const dashboardPath = dashboardMap[role] || "/dashboard/user";
        router.replace(dashboardPath);
      } catch (err) {
        // If auth fails, clear token and redirect to home
        sessionStorage.removeItem("fbToken");
        router.replace("/");
      } finally {
        setIsRedirecting(false);
      }
    };

    redirectToDashboard();
  }, [router]);

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
