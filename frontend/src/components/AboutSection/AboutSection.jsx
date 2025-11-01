// frontend/src/components/AboutSection/AboutSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './AboutSection.css';
// 🟢 Ensure you move your image to src/assets/buddha.jpg
import BuddhaImage from '../../assets/buddha.jpg'; 

export default function AboutSection() {
  const textContent = (
    <>
      <h2>Nurture Your Mind, Elevate Your Life</h2>
      <p>
        Mental health is the quiet strength behind every thought, emotion, and action. It influences how we cope with challenges, build relationships, and find meaning in our daily lives. When nurtured, it becomes the foundation of clarity, confidence, and inner peace.
      </p>
      
    </>
  );

  return (
    <div className="about-section-container">
      <div className="about-section-content">
        {/* Left Side: Description Box */}
        <motion.div
          className="description-box"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {textContent}
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          className="image-container"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src={BuddhaImage} alt="Lord Buddha meditating, symbolizing peace and mental clarity" />
        </motion.div>
      </div>
    </div>
  );
}