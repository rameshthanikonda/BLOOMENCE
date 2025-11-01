// frontend/src/pages/PrivacyPolicy.jsx

import React from 'react';
import Footer from '../components/Footer/Footer';
import './PageContent.css';

const PrivacyPolicy = () => {
  return (
    <div className="page-wrapper">
      <main className="page-main-content">
        <h1>Privacy Policy</h1>
        <p className="subtitle">Last Updated: October 18, 2025</p>

        <section className="about-section">
          <h2>1. Introduction</h2>
          <p>Bloomence ("we," "us," or "our") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you use the Bloomence application and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
        </section>

        <section className="about-section">
          <h2>2. Information We Collect and How We Collect It</h2>
          <p>We collect sensitive personal data related to your mental health status. This includes:</p>
          <ul>
            <li>
              <strong>Identity Data:</strong> Email address (for authentication) and user ID.
            </li>
            <li>
              <strong>Emotional Wellness Data:</strong> Your responses to validated questionnaires (PHQ-9, GAD-7, etc.), generated mental health scores, and tracked emotional growth metrics. This data is **anonymized** and stored securely.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and use the app, including interactions with the AI recommendations.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>3. Use of Your Information (Commitment to Anonymity)</h2>
          <p>We use the information we collect solely for the purpose of:</p>
          <ul>
            <li>Providing and personalizing your AI-driven recommendations.</li>
            <li>Tracking your progress and visualizing your emotional well-being journey.</li>
            <li>Improving the accuracy and effectiveness of our AI models.</li>
            <li>Processing your authenticated user sessions via Firebase.</li>
          </ul>
          <p>We **do not** sell or rent your personal health data to third parties under any circumstances.</p>
        </section>

        <section className="about-section">
          <h2>4. Data Security</h2>
          <p>We implement technical and organizational measures to secure your Personal Data from accidental loss and from unauthorized access, use, alteration, and disclosure. All emotional wellness data is encrypted both in transit and at rest.</p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;