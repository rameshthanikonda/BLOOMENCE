// src/pages/Questionnaires/PHQ9.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 🟢 Auth Context for user check
import "./PHQ9.css";
import downloadImage from "../../assets/download.jpeg";

// --- Questionnaire Data ---
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
];

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function PHQ9() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 🟢 Get current user from context

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(phq9Questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);

  // Backend API base
  const API_BASE = import.meta.env.VITE_API_URL || 'https://bloomence-mss1.onrender.com';

  // --- Handle Option Selection / Deselection ---
  const handleAnswer = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQ] =
      updatedAnswers[currentQ] === value ? null : value;

    setAnswers(updatedAnswers);
    setError(null);
  };

  const goToQuestion = (index, moveDirection) => {
    setDirection(moveDirection);
    setCurrentQ(index);
  };

  // --- Next Button Logic ---
  const handleNext = () => {
    if (answers[currentQ] === null) {
      setError("Please select an option before proceeding.");
      return;
    }

    setError(null);
    if (currentQ < phq9Questions.length - 1) {
      goToQuestion(currentQ + 1, 1);
    }
  };

  // --- Submission Logic ---
  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    setError(null);

    // 🛑 Check if user is logged in
    if (!currentUser) {
      setError("You must be logged in to submit results.");
      setLoading(false);
      return;
    }

    try {
      const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);

      // Extract user details
      const userName = currentUser.displayName;
      const userEmail = currentUser.email;

      const submitOnce = async (token) => {
        const res = await fetch(`${API_BASE}/api/results/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionnaireType: "PHQ-9",
            totalScore,
            userName,
            userEmail,
            firebaseUid: currentUser.uid,
          }),
        });
        return res;
      };

      // First try with a force-refreshed token
      let idToken = await currentUser.getIdToken(true);
      if (!idToken) throw new Error("Missing Firebase ID token");
      let response = await submitOnce(idToken);

      // If unauthorized, retry once with a freshly refreshed token
      if (response.status === 401) {
        console.warn("PHQ9 submit 401, retrying with refreshed token...");
        idToken = await currentUser.getIdToken(true);
        response = await submitOnce(idToken);
      }

      if (!response.ok) {
        let text = "";
        try { text = await response.text(); } catch { }
        console.error("PHQ9 submit failed:", response.status, text);
        throw new Error(text || `Failed to save result (status ${response.status}).`);
      }

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Submission failed. Please check server.");
      setLoading(false);
    }
  };

  const totalQuestions = phq9Questions.length;
  const answeredCount = answers.filter((val) => val !== null).length;
  const currentQuestionNumber = currentQ + 1;
  const questionVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const questionTransition = {
    type: "spring",
    stiffness: 260,
    damping: 25,
    duration: 0.5,
  };

  // --- Success Screen ---
  if (submitted) {
    const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);

    return (
      <div className="phq9-wrapper">
        <div className="phq9-background" aria-hidden="true"></div>
        <div className="phq9-page">
          <div className="phq9-content">
            <aside className="phq9-side-panel">
              <img
                src={downloadImage}
                alt="Download"
                className="panel-image"
                loading="lazy"
              />
            </aside>

            <div className="phq9-main">
              <div className="phq9-container result-card success">
                <h2>PHQ-9 Complete!</h2>
                <p>Your Depression Score is: <strong>{totalScore}</strong></p>
                <p>
                  Results saved successfully. Now, please complete the Anxiety
                  assessment.
                </p>
                <button
                  className="submit-btn"
                  onClick={() => navigate("/gad7")}
                >
                  Proceed to GAD-7 Assessment →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Questionnaire Screen ---
  return (
    <div className="phq9-wrapper">
      <div className="phq9-background" aria-hidden="true"></div>
      <div className="phq9-page">
        <div className="phq9-content">
          <aside className="phq9-side-panel">
            <img
              src={downloadImage}
              alt="Download"
              className="panel-image"
              loading="lazy"
            />
          </aside>

          <div className="phq9-main">
            <header className="phq9-header">
              <div className="phq9-heading">
                <h1>PHQ-9 Questionnaire</h1>
                <p className="intro-text">
                  Over the last 2 weeks, how often have you been bothered by any of the following problems?
                </p>
              </div>
              <div className="progress-panel">
                <span className="progress-label">Question</span>
                <span className="progress-count">{currentQuestionNumber} / {totalQuestions}</span>
                <span className="progress-subtext">{answeredCount} answered</span>
              </div>
            </header>

            <div className="phq9-container">
              <AnimatePresence
                mode="wait"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={currentQ}
                  className="question-card single-question-view"
                  custom={direction}
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={questionTransition}
                >
                  <p className="question-text">
                    {currentQuestionNumber}. {phq9Questions[currentQ]}
                  </p>

                  <div className="options">
                    {options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`option-button ${answers[currentQ] === opt.value ? "selected" : ""
                          }`}
                        onClick={() => handleAnswer(opt.value)}
                        disabled={loading}
                      >
                        <span
                          className="option-indicator"
                          aria-hidden="true"
                        ></span>
                        <span className="option-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {error && <p className="error-message">🚨 {error}</p>}

              <div className="navigation-controls">
                <button
                  type="button"
                  className="nav-btn secondary"
                  onClick={() => goToQuestion(currentQ - 1, -1)}
                  disabled={currentQ === 0 || loading}
                >
                  &larr; Previous
                </button>

                <button
                  type="button"
                  className="nav-btn primary"
                  onClick={() =>
                    currentQ === totalQuestions - 1
                      ? handleSubmit(answers)
                      : handleNext()
                  }
                  disabled={loading || answers[currentQ] === null}
                >
                  {loading
                    ? "Processing..."
                    : currentQ === totalQuestions - 1
                      ? "Submit"
                      : "Next Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
