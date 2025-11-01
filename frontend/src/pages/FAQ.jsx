// frontend/src/pages/FAQ.jsx
import React from 'react';
import './PageContent.css';

export default function FAQPage() {
  return (
    <div className="page-wrapper">
      <main className="page-main-content">
        <h1>Frequently Asked Questions</h1>
        <p className="subtitle">Everything you need to know about Bloomence: getting started, scoring, emails, and privacy.</p>

        {/* Table of Contents */}
        <nav aria-label="FAQ table of contents" style={{ marginBottom: 24 }}>
          <ul>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#assessments">Assessments & Scores</a></li>
            <li><a href="#emails">Emails & Notifications</a></li>
            <li><a href="#privacy">Privacy & Data</a></li>
            <li><a href="#account">Account & Security</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
        </nav>

        {/* Getting Started */}
        <section id="getting-started" className="about-section">
          <h2>Getting Started</h2>
          <details open>
            <summary>What is Bloomence?</summary>
            <p>Bloomence is a wellbeing companion that helps you check in with yourself using evidence-based assessments and simple summaries. It is informational and does not replace professional care.</p>
          </details>
          <details>
            <summary>How do I start?</summary>
            <p>Sign up or sign in, then take a quick check-in (e.g., PHQ‑9, GAD‑7). You’ll get an immediate score and can track progress over time.</p>
          </details>
          <details>
            <summary>How often should I use it?</summary>
            <p>Most people benefit from 1–2 brief check‑ins per week. You can check in anytime you want a current snapshot.</p>
          </details>
        </section>

        {/* Assessments & Scores */}
        <section id="assessments" className="about-section">
          <h2>Assessments & Scores</h2>
          <details>
            <summary>Which assessments are available?</summary>
            <p>We currently support PHQ‑9 (depressive symptoms) and GAD‑7 (anxiety symptoms). More evidence-based tools may be added in the future.</p>
          </details>
          <details>
            <summary>How should I interpret my score?</summary>
            <p>Scores indicate symptom severity ranges (e.g., PHQ‑9 and GAD‑7 have published cutoffs). The summaries are informational, not diagnostic. If you’re concerned, consider reaching out to a qualified professional.</p>
          </details>
          <details>
            <summary>Do you send alerts for high scores?</summary>
            <p>Yes—if your email preferences allow it. We may send a supportive follow‑up when recent scores are elevated. You can opt out in your email preferences.</p>
          </details>
        </section>

        {/* Emails & Notifications */}
        <section id="emails" className="about-section">
          <h2>Emails & Notifications</h2>
          <details>
            <summary>When do you send emails?</summary>
            <ul>
              <li><b>Welcome</b> — sent once to new users.</li>
              <li><b>Weekly digest</b> — summary of the past week’s results.</li>
              <li><b>Inactivity reminder</b> — if you haven’t checked in for a while.</li>
              <li><b>High‑score follow‑up</b> — when a recent score is elevated.</li>
            </ul>
          </details>
          <details>
            <summary>Can I turn emails off?</summary>
            <p>Yes. You can opt out of specific categories (digest, high‑score, re‑engagement) in your email preferences (coming soon).</p>
          </details>
        </section>

        {/* Privacy & Data */}
        <section id="privacy" className="about-section">
          <h2>Privacy & Data</h2>
          <details>
            <summary>How is my data protected?</summary>
            <p>Your data is stored securely. We only use it to provide Bloomence features and never share it without your permission.</p>
          </details>
          <details>
            <summary>Can I delete my data?</summary>
            <p>Yes. You can request account and data deletion at any time. We’ll guide you through a secure verification process.</p>
          </details>
          <details>
            <summary>Is Bloomence medical care?</summary>
            <p>No. Bloomence is informational and supportive. If you need medical advice or are in crisis, please contact a qualified professional or local support line.</p>
          </details>
        </section>

        {/* Account & Security */}
        <section id="account" className="about-section">
          <h2>Account & Security</h2>
          <details>
            <summary>I didn’t get an email—what should I check?</summary>
            <p>Look in Spam/Promotions, ensure your inbox isn’t full, and add our address to your contacts. If the issue persists, contact support.</p>
          </details>
          <details>
            <summary>How do I change my email or name?</summary>
            <p>Update your profile details in the account settings (coming soon). The email we store is used for notifications you’ve enabled.</p>
          </details>
        </section>

        {/* Support */}
        <section id="support" className="about-section">
          <h2>Support</h2>
          <details>
            <summary>How do I contact support?</summary>
            <p>Email us at support@bloomencecare.com. We aim to respond within 1–2 business days.</p>
          </details>
          <details>
            <summary>Do you have emergency support?</summary>
            <p>We are not an emergency service. If you are in immediate danger or crisis, please contact local emergency services or a crisis hotline in your country.</p>
          </details>
        </section>
      </main>
    </div>
  );
}
