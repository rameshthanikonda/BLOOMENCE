// frontend/src/components/TestimonialScroller/TestimonialData.js

// 🟢 CRITICAL: You must ensure you have 10 unique images in src/assets/
import UserAvatar1 from '../../assets/user1.jpg'; 
import UserAvatar2 from '../../assets/user2.jpg';
import UserAvatar3 from '../../assets/user3.jpg';
import UserAvatar4 from '../../assets/user4.jpg';
import UserAvatar5 from '../../assets/user5.jpg';
import UserAvatar6 from '../../assets/user6.jpg'; // Assuming you add these 5 extra user images
import UserAvatar7 from '../../assets/user7.jpg';
import UserAvatar8 from '../../assets/user8.jpg';
import UserAvatar9 from '../../assets/user9.jpg';
import UserAvatar10 from '../../assets/user10.jpg';

// Combined array of 10 unique assets
const ORIGINAL_AVATARS = [
    UserAvatar1, UserAvatar2, UserAvatar3, UserAvatar4, UserAvatar5,
    UserAvatar6, UserAvatar7, UserAvatar8, UserAvatar9, UserAvatar10
];

// We will define 10 unique entries here. The TestimonialScroller JSX will
// automatically double this array, resulting in 20 total cards for the seamless loop.
export const testimonialsData = [
    // --- ORIGINAL SET (5) ---
    {
        name: "Aarav Sharma",
        quote: "The personalized advice I received after my first PHQ-9 score was incredibly accurate and gave me actionable steps for better sleep.",
        role: "Software Developer",
        avatar: ORIGINAL_AVATARS[0]
    },
    {
        name: "Priya Singh",
        quote: "The dashboard is a game-changer. Tracking my anxiety score over time made my progress feel real and motivated me to continue therapy.",
        role: "Student & Blogger",
        avatar: ORIGINAL_AVATARS[1]
    },
    {
        name: "Rajesh Menon",
        quote: "Knowing I can get secure, AI-powered nutritional tips instantly has made managing my mood so much easier. Highly recommend the bot!",
        role: "Small Business Owner",
        avatar: ORIGINAL_AVATARS[2]
    },
    {
        name: "Kavya Reddy",
        quote: "The combination of the GAD-7 score and the custom video recommendations helped me finally understand my anxiety triggers.",
        role: "Graphic Designer",
        avatar: ORIGINAL_AVATARS[3]
    },
    {
        name: "Vikram Kohli",
        quote: "The continuous loop of assessments feels non-judgmental and supportive. It’s the perfect, private space for self-reflection.",
        role: "Project Manager",
        avatar: ORIGINAL_AVATARS[4]
    },
    
    // 🟢 NEW SET (5) - Use distinct names and quotes for the second half of the visible loop
    {
        name: "Ananya Rao",
        quote: "The 'Sleep Cycle' tips from the Gemini bot were exactly what I needed. My quality of rest has significantly improved in just two weeks.",
        role: "Content Creator",
        avatar: ORIGINAL_AVATARS[5]
    },
    {
        name: "Sanjay Naidu",
        quote: "As someone who deals with daily stress, the ability to track my GAD-7 score visually is powerful. It makes the progress tangible.",
        role: "Civil Engineer",
        avatar: ORIGINAL_AVATARS[6]
    },
    {
        name: "Diya Patel",
        quote: "The security features gave me confidence to start sharing my health data. It truly feels like a secure, non-judgmental space.",
        role: "University Researcher",
        avatar: ORIGINAL_AVATARS[7]
    },
    {
        name: "Faisal Khan",
        quote: "The metric cards clearly summarize my current state. It’s a very professional and insightful dashboard, unlike other tracking apps.",
        role: "Product Designer",
        avatar: ORIGINAL_AVATARS[8]
    },
    {
        name: "Neha Varma",
        quote: "The recommendations are practical and tailored, not generic. I appreciate the focus on brain health and hormone balance advice.",
        role: "Financial Analyst",
        avatar: ORIGINAL_AVATARS[9]
    },
];