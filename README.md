

# 🌿 **BLOOMENCE: Personalized Digital Wellness Assistant 🧠**
**Live Demo:** [https://bloomenceee.onrender.com](https://bloomenceee.onrender.com)

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

---

## 🛠️ **Tech Stack & Architecture**

**Frontend:** React, Vite, Firebase, Recharts, Framer Motion, OGL  
**Backend:** Node.js, Express.js, MongoDB, Firebase Admin SDK, Gemini API  
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
VITE_BACKEND_URL=http://localhost:3001

```
### 4️⃣ Start the frontend
```bash
npm run dev
```
---
**📜 License**

This project is licensed under the MIT License.
