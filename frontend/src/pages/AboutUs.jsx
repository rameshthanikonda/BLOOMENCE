// frontend/src/pages/AboutUs.jsx

import React from 'react';
import Footer from '../components/Footer/Footer';
// Import Header or ensure App.jsx handles it for global layout
import './PageContent.css'; // Assuming you create this for common page padding/styles

const AboutUs = () => {
  return (
    <div className="page-wrapper">
      {/* Header/Navbar assumed to be rendered by the main application wrapper (App.jsx) */}
      
      <main className="page-main-content">
        <h1>About Bloomence: Master Your Mind, Transform Your Life</h1>
        <p className="subtitle">Our mission is to democratize mental wellness by providing accessible, personalized, and proactive tools for emotional growth.</p>

        <section className="about-section">
          <h2>Our Philosophy: Proactive Wellness</h2>
          <p>We believe that mental health is not just the absence of illness, but a continuous journey of growth and self-discovery. Bloomence is designed as your constant companion on this path, offering insight and support before challenges become crises.</p>
        </section>

        <section className="about-section">
          <h2>How We Help You Bloom</h2>
          <ul>
            <li>
              <strong>Mental Health Scoring & Tracking:</strong> We provide structured questionnaires (like PHQ-9 and GAD-7) to generate an objective Mental Health Score, allowing you to track your progress over time.
            </li>
            <li>
              <strong>AI Recommendation Engine:</strong> Our proprietary AI analyzes your scores and historical data to deliver highly personalized content, exercises, and coping strategies tailored to your unique emotional needs.
            </li>
            <li>
              <strong>Secure & Private:</strong> Your emotional well-being data is highly sensitive. We are committed to strict data security and anonymity, ensuring your journey is completely private.
            </li>
            <li>
              <strong>Emergency Support:</strong> Integrated direct access to resources and essential emergency contacts when you need immediate help.
            </li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Our Commitment</h2>
          <p>We are a dedicated team of technologists, psychologists, and designers passionate about bridging the gap between clinical mental health support and daily life. Bloomence is built on clinical principles, ethical AI, and a deep respect for your privacy.</p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;