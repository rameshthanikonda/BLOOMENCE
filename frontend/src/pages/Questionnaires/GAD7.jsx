// src/pages/Questionnaires/GAD7.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./PHQ9.css";
import downloadImage from "../../assets/download.jpeg";

// --- GAD-7 Questionnaire Data ---
const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];
const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export default function GAD7() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(gad7Questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);

  // Backend API base
  const API_BASE = import.meta.env.VITE_API_URL || 'https://bloomence-mss1.onrender.com';

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

  const handleNext = () => {
    if (answers[currentQ] === null) {
      setError("Please select an option before proceeding.");
      return;
    }
    setError(null);
    if (currentQ < gad7Questions.length - 1) {
      goToQuestion(currentQ + 1, 1);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    setError(null);

    if (!currentUser) {
      setError("You must be logged in to submit results.");
      setLoading(false);
      return;
    }

    try {
      const totalScore = finalAnswers.reduce((sum, val) => sum + (val || 0), 0);
      const userName = currentUser.displayName;
      const userEmail = currentUser.email;

      const submitOnce = async (token) => {
        const res = await fetch(`${API_BASE}/api/results/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            questionnaireType: 'GAD-7',
            totalScore,
            userName,
            userEmail,
            firebaseUid: currentUser.uid
          })
        });
        return res;
      };

      let idToken = await currentUser.getIdToken(true);
      if (!idToken) throw new Error('Missing Firebase ID token');
      let response = await submitOnce(idToken);

      if (response.status === 401) {
        console.warn('GAD7 submit 401, retrying with refreshed token...');
        idToken = await currentUser.getIdToken(true);
        response = await submitOnce(idToken);
      }

      if (!response.ok) {
        let text = '';
        try { text = await response.text(); } catch { }
        console.error('GAD7 submit failed:', response.status, text);
        throw new Error(text || `Failed to save result (status ${response.status}).`);
      }

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Submission failed. Please check server.');
      setLoading(false);
    }
  };

  const totalQuestions = gad7Questions.length;
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

  if (submitted) {
    const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
    return (
      <div className="phq9-wrapper">
        <div className="phq9-background" aria-hidden="true"></div>
        <div className="phq9-page">
          <button className="home-btn" onClick={() => navigate('/')}> 
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3.172 2.293 12.88a1 1 0 0 0 1.414 1.414L5 13.001V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-6.999l1.293 1.293a1 1 0 0 0 1.414-1.414L12 3.172Z"/>
            </svg>
            Go to Home
          </button>
          <div className="phq9-content">
            <aside className="phq9-side-panel">
              <img
                src={downloadImage}
                alt="GAD-7 illustration"
                className="panel-image"
                loading="lazy"
              />
            </aside>

            <div className="phq9-main">
              <div className="phq9-container result-card success">
                <h2>GAD-7 Complete!</h2>
                <p>Your Anxiety Score is: <strong>{totalScore}</strong></p>
                <p>All assessments complete. View your personalized dashboard.</p>
                <button
                  className="submit-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phq9-wrapper">
      <div className="phq9-background" aria-hidden="true"></div>
      <div className="phq9-page">
        <button className="home-btn" onClick={() => navigate('/')}> 
          <svg className="icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3.172 2.293 12.88a1 1 0 0 0 1.414 1.414L5 13.001V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-6.999l1.293 1.293a1 1 0 0 0 1.414-1.414L12 3.172Z"/>
          </svg>
          Go to Home
        </button>
        <div className="phq9-content">
          <aside className="phq9-side-panel">
            <img
              src={downloadImage}
              alt="GAD-7 illustration"
              className="panel-image"
              loading="lazy"
            />
          </aside>

          <div className="phq9-main">
            <header className="phq9-header">
              <div className="phq9-heading">
                <h1>GAD-7 Questionnaire</h1>
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
                    {currentQuestionNumber}. {gad7Questions[currentQ]}
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
                        <span className="option-indicator" aria-hidden="true"></span>
                        <span className="option-label">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {error && <p className="error-message"> {error}</p>}

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
