import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// --- Step 1: Resolve Firebase Service Account file path ---
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Ensure the path exists
if (!serviceAccountPath) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not defined in .env file.");
}

// Resolve full path relative to this file
const resolvedPath = path.resolve(serviceAccountPath);

// --- Step 2: Read and parse the service account JSON file ---
let serviceAccount;
try {
  const fileContents = fs.readFileSync(resolvedPath, "utf8");
  serviceAccount = JSON.parse(fileContents);
} catch (err) {
  console.error("❌ Error reading or parsing Firebase service account JSON:", err);
  throw new Error("Invalid Firebase Service Account JSON format in environment variable.");
}

// --- Step 3: Initialize Firebase Admin SDK ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully.");
}

// --- Step 4: Middleware to verify Firebase ID Token ---
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next(); // proceed to next middleware or route
  } catch (error) {
    console.error("❌ Firebase token verification failed:", error);
    return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
};

// --- Step 5: Export the initialized admin object (optional) ---
export { admin };