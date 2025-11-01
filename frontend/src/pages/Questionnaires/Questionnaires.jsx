import React from "react";
import { useNavigate } from "react-router-dom";
import "./Questionnaires.css";

export default function Questionnaires() {
  const navigate = useNavigate();

  return (
    <div className="questionnaires-container">
      <h1>Select a Questionnaire</h1>
      <div className="cards">
        <div className="card" onClick={() => navigate("/phq9")}>
          <h2>PHQ-9</h2>
          <p>Depression Screening Questionnaire</p>
        </div>
        <div className="card" onClick={() => navigate("/gad7")}>
          <h2>GAD-7</h2>
          <p>Anxiety Screening Questionnaire</p>
        </div>
      </div>

      <div className="floating-copy">
        <p className="floating-intro">Your wellbeing journey starts here.</p>
        <p className="floating-sub">
          Choose the screening that fits your need and gain a clearer perspective in just a few minutes.
        </p>
        <div className="floating-tags" role="list">
          <span role="listitem">Confidential</span>
          <span role="listitem">Evidence-based</span>
          <span role="listitem">Personal insights</span>
        </div>
      </div>
    </div>
  );
}
