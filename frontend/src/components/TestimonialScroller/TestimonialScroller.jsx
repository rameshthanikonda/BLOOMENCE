// frontend/src/components/TestimonialScroller/TestimonialScroller.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './TestimonialScroller.css';
import { testimonialsData } from './TestimonialData'; // Import the data

// Note: We use a larger data set (the original 5 + duplicates) to ensure a smooth loop transition.
const DISPLAY_DATA = testimonialsData;


const TestimonialCard = ({ testimonial }) => (
    <div className="testimonial-scroller-card">
        {/* Left Side: Circular Image */}
        <div className="testimonial-avatar-wrapper">
            <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="testimonial-avatar" 
            />
        </div>
        
        {/* Right Side: Quote and Details */}
        <div className="testimonial-details">
            <p className="testimonial-quote">
                "{testimonial.quote}"
            </p>
            <p className="testimonial-author-name">
                — {testimonial.name}
                <span className="testimonial-role">{testimonial.role}</span>
            </p>
        </div>
    </div>
);


export default function TestimonialScroller() {
    // Calculate the total number of items to determine the animation distance
    const totalItems = DISPLAY_DATA.length;
    // Set a realistic duration (e.g., 3 seconds per item)
    const animationDuration = `${totalItems * 3}s`; 

    return (
        <div className="testimonial-scroller-section">
            <motion.h2
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="testimonial-section-title"
            >
                Community Voices
            </motion.h2>

            <div className="scroller-track-container">
                <div 
                    className="scroller-track" 
                    style={{ animationDuration: animationDuration }}
                >
                    {/* CRITICAL: Render the data twice for a seamless loop */}
                    {[...DISPLAY_DATA, ...DISPLAY_DATA].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </div>
    );
}