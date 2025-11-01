// frontend/src/pages/TermsOfUse.jsx

import React from 'react';
import Footer from '../components/Footer/Footer';
import './PageContent.css';

const TermsOfUse = () => {
  return (
    <div className="page-wrapper">
      <main className="page-main-content">
        <h1>Terms of Use</h1>
        <p className="subtitle">Effective Date: October 18, 2025</p>

        <section className="about-section">
          <h2>1. Acceptance of the Terms of Use</h2>
          <p>By accessing or using the Bloomence application and its services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you must not access or use the application.</p>
        </section>

        <section className="about-section">
          <h2>2. Critical Medical Disclaimer</h2>
          <p className="disclaimer-text">
            **BLOOMENCE IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.** The content, including the AI recommendations and Mental Health Scores, is provided for informational and self-monitoring purposes only. Always seek the advice of a qualified mental health professional or doctor with any questions you may have regarding a medical condition or mental health disorder. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
          </p>
        </section>

        <section className="about-section">
          <h2>3. User Responsibilities</h2>
          <p>You agree not to use the application to engage in any activity that is harmful, illegal, or that violates the privacy or rights of others. This includes submitting false or malicious data or attempting to disrupt the service.</p>
        </section>

        <section className="about-section">
          <h2>4. Intellectual Property</h2>
          <p>All content, features, and functionality of Bloomence, including the AI models, code, design, and logos, are owned by Bloomence, its licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws.</p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;