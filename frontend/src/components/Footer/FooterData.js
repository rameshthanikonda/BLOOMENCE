// frontend/src/components/Footer/FooterData.js

export const footerSections = [
    {
        title: "Platform",
        links: [
            { name: "Dashboard", url: "/dashboard" },
            { name: "Questionnaires", url: "/questionnaires" },
            { name: "AI Recommendation", url: "/ai-recommendation" },
            { name: "Emergency Contact", url: "/emergency-contact" },
        ]
    },
    {
        title: "Support",
        links: [
            { name: "FAQ", url: "/faq" },
            { name: "Contact Us", url: "/contact" },
            { name: "Help Center", url: "/help" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Terms of Use", url: "/terms" },
            { name: "Privacy Policy", url: "/privacy" },
            { name: "Cookie Policy", url: "/cookies" },
        ]
    }
];

export const contactInfo = {
    email: "support@bloomence.com",
    phone: "+91 98765 43210",
    address: "Bloomence, Innovation Hub, Bengaluru, India"
};