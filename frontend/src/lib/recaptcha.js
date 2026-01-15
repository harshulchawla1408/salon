/**
 * reCAPTCHA Verifier Singleton
 * Ensures only one instance exists and is properly cleaned up
 */
import { RecaptchaVerifier } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

let recaptchaVerifierInstance = null;

/**
 * Initialize reCAPTCHA verifier (singleton)
 * Must be called before using phone OTP
 */
export function initializeRecaptcha() {
  // Check if container exists
  if (typeof window === "undefined") return null;

  const container = document.getElementById("recaptcha-container");
  if (!container) {
    console.error("recaptcha-container not found in DOM");
    return null;
  }

  // If verifier already exists and is valid, return it
  if (window.recaptchaVerifier && recaptchaVerifierInstance) {
    return window.recaptchaVerifier;
  }

  // Clear any existing verifier
  clearRecaptcha();

  try {
    // Create new verifier
    recaptchaVerifierInstance = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA verified
        },
        "expired-callback": () => {
          // reCAPTCHA expired - clear and recreate
          clearRecaptcha();
        },
      }
    );

    window.recaptchaVerifier = recaptchaVerifierInstance;
    return recaptchaVerifierInstance;
  } catch (error) {
    console.error("Error initializing reCAPTCHA:", error);
    clearRecaptcha();
    return null;
  }
}

/**
 * Clear reCAPTCHA verifier
 * Must be called on logout and before creating new instance
 */
export function clearRecaptcha() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (error) {
      // Ignore errors during cleanup
      console.warn("Error clearing reCAPTCHA:", error);
    }
    window.recaptchaVerifier = null;
  }

  if (recaptchaVerifierInstance) {
    recaptchaVerifierInstance = null;
  }

  // Clear container if it exists
  if (typeof window !== "undefined") {
    const container = document.getElementById("recaptcha-container");
    if (container) {
      container.innerHTML = "";
    }
  }
}

/**
 * Get current reCAPTCHA verifier instance
 */
export function getRecaptchaVerifier() {
  return window.recaptchaVerifier || null;
}
