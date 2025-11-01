// frontend/src/components/ValueSection/ValueSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Need Link for footer navigation
import './ValueSection.css'; 

const ValueData = [
  {
    title: "Personalized Insights",
    description: "Our platform uses PHQ-9 and GAD-7 to create a unique data map of your mental state, moving beyond generalized advice.",
    icon: "🎯", 
    color: "#00d9a5", // Green Accent
  },
  {
    title: "Continuous Tracking",
    description: "Visualize your mental health journey with historical charts, allowing you to quickly spot trends and measure progress over time.",
    icon: "📈", 
    color: "#4285F4", // Blue Accent
  },
  {
    title: "Gemini-Powered Support",
    description: "Receive instant, tailored advice on nutrition, sleep, and coping mechanisms from our secure, AI-driven wellness coach.",
    icon: "🧠", 
    color: "#FF9800", // Orange Accent
  },
  {
    title: "Secure & Confidential",
    description: "Your health data is protected using Firebase Authentication and stored securely in MongoDB, ensuring complete privacy.",
    icon: "🔒", 
    color: "#B71C1C", // Red/Security Accent
  },
  {
    title: "Actionable Recommendations",
    description: "Move beyond diagnosis with practical, research-backed advice linked directly to specific articles and expert videos.",
    icon: "💡", // Idea/Action
    color: "#00BCD4", // Cyan Accent
  },
  {
    title: "Non-Judgmental Space",
    description: "We provide a safe, private environment for self-assessment and growth, emphasizing compassion and self-awareness.",
    icon: "🧘", // Zen/Peace
    color: "#6A1B9A", // Purple Accent
  },
];

// 🟢 ESSENTIAL LINKS for the compact footer
const ESSENTIAL_LINKS = [
  { name: "Privacy Policy", url: "/PrivacyPolicy" },
  { name: "Terms of Use", url: "/TermsOfUse" },
  { name: "Contact", url: "mailto:support@bloomence.com" },
];


// Animation for staggered card entry (Unchanged)
const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: i => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut"
    }
  }),
};

// Component for a single value card (Unchanged)
const ValueCard = ({ data, index }) => (
    <motion.div
        className="value-card"
        custom={index}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="value-icon-wrapper" style={{ backgroundColor: data.color + '33' }}>
            <span className="value-icon" style={{ color: data.color }}>{data.icon}</span>
        </div>
        <h3 className="value-title" style={{ color: data.color }}>{data.title}</h3>
        <p className="value-description">{data.description}</p>
    </motion.div>
);

// 🌼 MAIN COMPONENT
export default function ValueSection() {
    // Contact details embedded into the JSX
    const CONTACT_DETAILS = {
        email: "bloomencecare@gmail.com",
        location: "Kurnool, Andhra Pradesh, India",
    };
    
    return (
        <div className="value-section-container">
            {/* 🟢 CRITICAL FIX: Only rendering the main h2 heading */}
            <motion.h2
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="value-main-title"
            >
                Why Bloomence Matters
            </motion.h2>

            
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="value-subtitle"
            >
                Our commitment is to provide personalized, secure, and actionable steps toward mental well-being.
            </motion.p>

            <div className="value-cards-grid">
                {ValueData.map((item, index) => (
                    <ValueCard key={item.title} data={item} index={index} />
                ))}
            </div>

            {/* 🟢 EMBEDDED COMPACT FOOTER UI */}
            <footer className="value-footer-embedded">
                <div className="value-footer-content">
                    {/* LEFT: Copyright and Brand */}
                    <div className="value-footer-brand">
                        <span className="footer-brand-title-small">BLOOMENCE</span>
                        <span className="footer-copyright">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>

                    {/* RIGHT: Essential Links and Contact Details */}
                    <div className="value-footer-right-block">
                        <div className="value-footer-links">
                            <Link to="/AboutUs" className="footer-link-item">About Us</Link>
                            {ESSENTIAL_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.url}
                                    className="footer-link-item"
                                    target={link.url.startsWith('mailto') ? '_self' : '_blank'}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        
                        {/* Contact Details (Email and Location) */}
                        <div className="value-footer-contact-info">
                            <a href={`mailto:${CONTACT_DETAILS.email}`} className="footer-contact-item">
                                {CONTACT_DETAILS.email}
                            </a>
                            <span className="footer-contact-item footer-location">
                                {CONTACT_DETAILS.location}
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}