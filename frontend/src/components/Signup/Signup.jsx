// src/pages/Signup/Signup.jsx 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🟢 CRITICAL: Import useNavigate
import "./Signup.css";
import { auth, googleProvider, microsoftProvider, appleProvider } from "../../firebaseConfig";// NOTE: Path assumption
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Google Icon (Unchanged)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 533.5 544.3">
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-17.6-1.6-34.5-4.6-50.9H272v96.4h147.1c-6.4 34.5-25.6 63.8-54.7 83.4v69.3h88.7c52-47.8 82.4-118.5 82.4-198.2z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c73.7 0 135.7-24.3 180.9-65.8l-88.7-69.3c-24.5 16.4-56 26-92.3 26-70.9 0-131-47.9-152.4-112.6H27.1v70.8C72.4 488.2 166.9 544.3 272 544.3z"
    />
    <path
      fill="#FBBC05"
      d="M119.6 323.7c-11.2-33.5-11.2-69.6 0-103.1V150H27.1c-37.1 72-37.1 158.5 0 230.5l92.5-56.8z"
    />
    <path
      fill="#EA4335"
      d="M272 107.7c39.8 0 75.7 13.7 103.9 40.7l77.7-77.7C406.7 24.3 344.7 0 272 0 166.9 0 72.4 56.2 27.1 150l92.5 56.8C141 155.6 201.1 107.7 272 107.7z"
    />
  </svg>
);
const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 71 71">
    <path fill="#F25022" d="M0 0h33.5v33.5H0z" />
    <path fill="#7FBA00" d="M37.5 0H71v33.5H37.5z" />
    <path fill="#00A4EF" d="M0 37.5h33.5V71H0z" />
    <path fill="#FFB900" d="M37.5 37.5H71V71H37.5z" />
  </svg>
);

// 🟢 NEW ICON: Apple Icon
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.15 1.5c.34.45 0 1.25-.45 1.48C9.55 3.73 7.8 6 7.8 8.9c0 2.2 1.3 4.2 3.1 5.3 1.2.7 2.3.6 2.3-.6 0-.8-1.7-1.4-2.7-1.4-.4 0-.8.1-1 .3-.3.2-.5.5-.6.8-.2.5 0 1.1.5 1.4.6.4 1.5.5 2.1 0 1.4-1.2 3.5-3.3 3.5-6.7 0-3.6-2.5-6.1-5.7-6.1-2 0-3.5 1.1-4.2 2.3C4.8 4.3 4.1 3 3.5 3c-.4 0-.9.2-1.1.6-.2.4-.2.8 0 1.2.6.9 1.6 2.3 1.9 4.3 0 0 .1.6-.3.8-.2.1-1.3.4-2.8-.7-1.1-.8-1.7-1.9-1.7-3.2 0-1.8.8-3.2 1.7-4.1C4.4.9 6.2 0 8.7 0c2.7 0 5 1.2 6.5 3.3.4-.2.5-.5.5-.8 0-.3-.1-.5-.4-.7-.2-.2-.6-.3-.9-.2l-.6.2z"/>
  </svg>
);

// Lock Icon (toggles locked/unlocked visuals)
const LockIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    {open ? (
      // unlocked
      <path d="M17 8V7a5 5 0 1 0-10 0v1H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm11 5v6H4v-6h16Z" />
    ) : (
      // locked
      <path d="M17 8V7a5 5 0 1 0-10 0v1H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm3 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
    )}
  </svg>
);

export default function SignupLogin() {
  const navigate = useNavigate(); // CRITICAL: Initialize useNavigate
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        alert("Logged in successfully!");
      } else {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        await createUserWithEmailAndPassword(auth, form.email, form.password);
        alert("Signed up successfully!");
      }

      // ACTION: Navigate to home after successful email/password login
      navigate('/'); 

    } catch (error) {
      alert(" " + error.message);
    }
  };

  const handleSocialClick = async (providerName) => { // Renamed for clarity
    try {
      let provider;

      // CRITICAL: Map providerName to the imported Firebase provider object
      if (providerName === "Google") {
        provider = googleProvider;
      } else if (providerName === "Microsoft") {
        provider = microsoftProvider;
      } else if (providerName === "Apple") {
        provider = appleProvider;
      } else {
        alert(`Provider ${providerName} not supported.`);
        return;
      }

      await signInWithPopup(auth, provider);
      
      // Navigate on success for all social logins
      navigate('/'); 

    } catch (error) {
      alert(" " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>
        <p>
          Sign-Up for free to access all features and stay updated.
        </p>

        {!showEmailForm ? (
          <>
            <button
              className="social-btn google"
              onClick={() => handleSocialClick("Google")}
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              className="social-btn microsoft"
              onClick={() => handleSocialClick("Microsoft")}
            >
              <MicrosoftIcon /> Microsoft Account 
            </button>
           
            <button
              className="social-btn email"
              onClick={() => setShowEmailForm(true)}
            >
              Continue with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="password-field">
              Password
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-label="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <span
                  className="eye-icon"
                  role="button"
                  tabIndex={0}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPasswordVisible(!passwordVisible); }}
                >
                  <LockIcon open={passwordVisible} />
                </span>
              </div>
            </label>
            {!isLogin && (
              <label className="password-field">
                Confirm Password
                <div className="password-wrapper">
                  <input
                    type={confirmVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    aria-label="Confirm Password"
                    autoComplete="new-password"
                  />
                  <span
                    className="eye-icon"
                    role="button"
                    tabIndex={0}
                    aria-label={confirmVisible ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setConfirmVisible(!confirmVisible)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setConfirmVisible(!confirmVisible); }}
                  >
                    <LockIcon open={confirmVisible} />
                  </span>
                </div>
              </label>
            )}
            <button type="submit" className="btn-primary">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
        )}

        <div className="toggle-text">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowEmailForm(false); // Reset to social login first
                }}
                className="toggle-btn"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowEmailForm(false); // Reset to social login first
                }}
                className="toggle-btn"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <div className="footer-links">
          <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}