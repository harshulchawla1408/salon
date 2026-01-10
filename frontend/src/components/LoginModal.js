"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, OAuthProvider } from "@/lib/firebase";
import api from "@/lib/api";
import { toAustralianE164 } from "@/lib/phone";

export default function LoginModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem("fbToken");
        if (!token) return;

        const res = await api.get("/auth/me");
        const userData = res.data;

        const dashboardMap = {
          admin: "/dashboard/admin",
          barber: "/dashboard/barber",
          user: "/dashboard/user",
          receptionist: "/dashboard/receptionist",
        };

        router.push(dashboardMap[userData.role] || "/dashboard/user");
        setIsOpen(false);
      } catch (err) {
        sessionStorage.removeItem("fbToken");
      }
    };

    checkAuth();
  }, [router]);

  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const phoneNumber = toAustralianE164(phone);
      initializeRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      sessionStorage.setItem("fbToken", idToken);

      // Login endpoint returns role for dashboard redirection
      const res = await api.post("/api/auth/login");
      const role = res.data.role;

      const dashboardMap = {
        admin: "/dashboard/admin",
        barber: "/dashboard/barber",
        user: "/dashboard/user",
        receptionist: "/dashboard/receptionist",
      };

      router.push(dashboardMap[role] || "/dashboard/user");
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP");
      sessionStorage.removeItem("fbToken");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const idToken = await result.user.getIdToken();

      sessionStorage.setItem("fbToken", idToken);

      // Login endpoint returns role for dashboard redirection
      const res = await api.post("/api/auth/login");
      const role = res.data.role;

      const dashboardMap = {
        admin: "/dashboard/admin",
        barber: "/dashboard/barber",
        user: "/dashboard/user",
        receptionist: "/dashboard/receptionist",
      };

      router.push(dashboardMap[role] || "/dashboard/user");
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google sign-in failed");
      sessionStorage.removeItem("fbToken");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await auth.signInWithPopup(provider);
      const idToken = await result.user.getIdToken();

      sessionStorage.setItem("fbToken", idToken);

      // Login endpoint returns role for dashboard redirection
      const res = await api.post("/api/auth/login");
      const role = res.data.role;

      const dashboardMap = {
        admin: "/dashboard/admin",
        barber: "/dashboard/barber",
        user: "/dashboard/user",
        receptionist: "/dashboard/receptionist",
      };

      router.push(dashboardMap[role] || "/dashboard/user");
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Apple sign-in failed");
      sessionStorage.removeItem("fbToken");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gray-900 text-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Urban Gabhru</h2>
          <p className="text-gray-400">
            {step === "phone" ? "Enter your mobile number" : "Enter the OTP sent to your phone"}
          </p>
        </div>

        {step === "phone" ? (
          <div className="space-y-6">
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <input
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-gray-100 disabled:bg-gray-700 text-gray-900 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full py-3 bg-black hover:bg-gray-800 disabled:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError("");
                setOtp("");
              }}
              className="w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Back to phone number
            </button>
          </form>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}