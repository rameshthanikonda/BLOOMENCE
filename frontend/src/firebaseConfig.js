import { initializeApp } from "firebase/app";
// 🟢 IMPORT: Import the OAuthProvider for Microsoft and Apple
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCEP6wrpURMbAtq7INx5mbAL0txz4ftPdA",
  authDomain: "ai-edu-93fe3.firebaseapp.com",
  projectId: "ai-edu-93fe3",
  storageBucket: "ai-edu-93fe3.firebasestorage.app",
  messagingSenderId: "631409150460",
  appId: "1:631409150460:web:804b3d1b08f772ca00ca79",
  measurementId: "G-MQCJMQZZ6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// 🟢 NEW PROVIDERS ADDED 
// 1. Microsoft Provider (using 'microsoft.com' as the provider ID)
export const microsoftProvider = new OAuthProvider('microsoft.com');
try { microsoftProvider.setCustomParameters({ prompt: 'select_account' }); } catch (_) {}

// 2. Apple Provider (using 'apple.com' as the provider ID)
export const appleProvider = new OAuthProvider('apple.com');


// NOTE: If you need to request user details like name or specific permissions 
// (especially important for Apple), you might need to uncomment and adjust scopes:
// appleProvider.addScope('email');
// appleProvider.addScope('name');


export default app;
