import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Singleton pattern - initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../firebase-admin.json"), "utf-8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialization failed:", error);
    throw error;
  }
} else {
  console.log("✅ Firebase Admin SDK already initialized");
}

export default admin;
