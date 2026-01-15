"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = sessionStorage.getItem("fbToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      // Token invalid or expired
      sessionStorage.removeItem("fbToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Clear Firebase session
      const { signOut, auth } = await import("@/lib/firebase");
      if (signOut && auth) {
        try {
          await signOut(auth);
        } catch (firebaseErr) {
          // Continue even if Firebase signOut fails
          console.warn("Firebase signOut error:", firebaseErr);
        }
      }
      
      // Clear reCAPTCHA
      if (typeof window !== "undefined") {
        const { clearRecaptcha } = await import("@/lib/recaptcha");
        clearRecaptcha();
      }

      // Clear backend session
      try {
        await api.post("/api/auth/logout");
      } catch (apiErr) {
        // Continue even if API call fails
        console.warn("Backend logout error:", apiErr);
      }
    } catch (err) {
      // Continue with logout even if any step fails
      console.error("Logout error:", err);
    } finally {
      // Clear all local state
      sessionStorage.removeItem("fbToken");
      setUser(null);
      router.push("/");
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    loading,
    login,
    logout,
    refreshAuth: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
