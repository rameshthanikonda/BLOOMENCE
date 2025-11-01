

# 🌿 **BLOOMENCE: Personalized Digital Wellness Assistant 🧠**
<<<<<<< HEAD
**Live Demo:** [https://bloomenceee.onrender.com](https://bloomence-2.onrender.com/)
=======
**Live Demo:** [https://bloomence-2.onrender.com/](https://bloomence-2.onrender.com/)
>>>>>>> 7e01dfe (second  commit)

---

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-blueviolet?logo=google)
![Render](https://img.shields.io/badge/Hosted%20on-Render-black?logo=render)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

Bloomence is a **personalized digital wellness assistant** designed to help users **track, understand, and improve their mental health** through clinical assessments — **PHQ-9 (Depression)** and **GAD-7 (Anxiety)** — combined with **AI-driven wellness insights**.

The app uses a **secure hybrid architecture** combining:
- **Firebase** → Authentication  
- **Node.js + MongoDB** → Backend & Data Storage  
- **Gemini AI** → Personalized mental wellness recommendations  

---

## 📑 **Table of Contents**

- [✨ Features]
- [🛠️ Tech Stack & Architecture]
- [🚀 Getting Started (Local Development)]
  - [⚙️ Backend Setup]
  - [💻 Frontend Setup]
- [📜 License](#-license)

---

## ✨ **Features**

1. 🔒 **Secure Authentication**
   - Firebase handles sign-up/login (Email, Password, Google OAuth).  
2. 🧭 **Protected Routes**
   - Dashboard and Questionnaires accessible only for logged-in users.  
3. 🧩 **Dual Clinical Assessment**
   - PHQ-9 & GAD-7 with seamless, responsive UI.  
4. ⚙️ **Dynamic Data Flow**
   - Secure transmission using Firebase ID tokens to backend.  
5. 📊 **Personalized Dashboard**
   - Charts and metrics powered by **Recharts** for real-time progress tracking.  
6. 🤖 **AI Wellness Coach (BloomBot)**
   - Personalized recommendations using **Gemini AI**.  
7. 💫 **Modern, Animated UI**
   - Built with **Framer Motion**, **OGL**, and a polished dark theme.  

8. 🧰 **Self‑Help Tools (Tabbed Quick Switch)**
   - One‑click tabs for:
     - CBT Thought Reframing
     - Rewards & Encouragements (streaks, progress badge)
     - Today’s Wellness Suggestion
   - Compact pill buttons with accessible roles/aria.

9. 🎙️ **Voice Input for AI chat**
   - Web Speech API mic button with animated state.

10. 🧵 **Streaming AI Responses**
    - Server‑sent events (SSE) stream with graceful fallback to JSON.

11. 🏠 **Consistent “Go to Home” buttons**
    - Dashboard‑style pill button with icon replicated across PHQ‑9, GAD‑7, and Questionnaires pages.

---

## 🛠️ **Tech Stack & Architecture**

**Frontend:** React, Vite, Firebase, Recharts, Framer Motion, OGL, lucide‑react (icons)  
**Backend:** Node.js, Express.js, MongoDB, Firebase Admin SDK, Gemini API, Socket.IO (installed), Nodemailer  
**Hosting:** Render  
**Authentication:** Firebase (Email + Google)



---

## 🚀 **Getting Started (Local Development)**

### 🧩 **Prerequisites**

- Node.js (v18+)
- npm 
- MongoDB Atlas cluster
- Firebase project with Authentication enabled
- Gemini API key
- Firebase Admin SDK JSON key

---

## ⚙️ **Backend Setup**

### 1️⃣ Navigate to the backend folder
```bash
cd backend
```


### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Create .env file inside /backend
```bash
PORT=3001
MONGO_URI="your_mongodb_connection_string"
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
GEMINI_API_KEY="your_gemini_api_key"

# Optional: SMTP config for email (Nodemailer)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your_smtp_username"
SMTP_PASS="your_smtp_password"
FROM_EMAIL="Bloomence <no-reply@yourdomain.com>"
```
### 4️⃣ Start the backend server
```bash
npm start
```
## 💻 Frontend Setup

### 1️⃣ Navigate to frontend folder
```bash
cd frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```
### 3️⃣ Create .env file inside /frontend
```bash
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"

# Base URL for backend API used by AI endpoints and results saving
# The app supports VITE_API_URL (preferred) or VITE_BACKEND_URL for backward compatibility
VITE_API_URL=http://localhost:3001
# VITE_BACKEND_URL=http://localhost:3001

```
### 4️⃣ Start the frontend
```bash
npm run dev
```
---
**📜 License**

This project is licensed under the MIT License.

---

## 🆕 What’s New (Highlights)

- Self‑Help Tools tabbed interface (CBT, Rewards & Encouragements, Today’s Wellness)
- Voice input and SSE streaming for AI chat (with fallback)
- Dashboard‑style "Go to Home" button replicated across PHQ‑9, GAD‑7, and Questionnaires
- Layout polish for Articles/Videos, plus improved accessibility on buttons and tabs

## 📦 Notable Libraries Installed

- frontend
  - react, vite, firebase, framer‑motion, recharts, lucide‑react
- backend
  - express, mongoose, firebase‑admin, google‑genai (Gemini), cors, dotenv
  - socket.io (installed; available for real‑time features)

