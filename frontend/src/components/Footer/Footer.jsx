// frontend/src/components/Footer/Footer.jsx (MODIFIED FOR COMPACTNESS)

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Footer.css';

// Using hardcoded links for simplicity, instead of importing FooterData
const ESSENTIAL_LINKS = [
    { name: "About Us", url: "/AboutUs" },
    { name: "FAQ", url: "/faq" },
    { name: "Privacy Policy", url: "/PrivacyPolicy" },
    { name: "Terms of Use", url: "/TermsOfUse" },
    { name: "Contact", url: "mailto:support@bloomence.com" },
];

export default function Footer() {
    return (
        <motion.footer 
            className="main-footer-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="footer-compact-content">
                
                {/* Left Side: Brand and Copyright */}
                <div className="footer-brand-info">
                    <h3 className="footer-brand-title">BLOOMENCE</h3>
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>

                {/* Right Side: Essential Links */}
                <div className="footer-links-group">
                    {ESSENTIAL_LINKS.map(link => {
                        const isExternal = link.url.startsWith('http') || link.url.startsWith('mailto:');
                        return isExternal ? (
                            <a key={link.name} href={link.url} className="footer-link-item">
                                {link.name}
                            </a>
                        ) : (
                            <Link key={link.name} to={link.url} className="footer-link-item">
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.footer>
    );
}