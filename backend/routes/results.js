// backend/routes/results.js

const express = require('express');
const Result = require('../models/Result');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');
const router = express.Router();

// Route to save a new questionnaire result
// POST /api/results/save
router.post('/save', async (req, res) => {
    // 🟢 CRITICAL: Get the verified UID from the middleware
    const firebaseUid = req.user.uid;

    // Destructure data from the request body
    const { questionnaireType, totalScore, userName, userEmail } = req.body;

    // Basic Validation Check
    if (!questionnaireType || totalScore === undefined || !userEmail) {
        return res.status(400).json({ message: 'Missing essential data (score, type, or user email).' });
    }

    try {
        const newResult = new Result({
            firebaseUid,
            questionnaireType,
            totalScore,
            userName: userName,
            userEmail: userEmail,
            createdAt: new Date()
        });

        await newResult.save();
        res.status(201).json({
            message: 'Result saved successfully!',
            id: newResult._id
        });

        // Realtime notify this user room
        try {
            const io = req.app.get('io');
            if (io) {
                io.to(firebaseUid).emit('result:saved', {
                    id: newResult._id,
                    questionnaireType,
                    totalScore,
                    createdAt: newResult.createdAt
                });
            }
        } catch (_) { }

        // High-score alert (non-blocking)
        try {
            const user = await User.findOneAndUpdate(
                { firebaseUid },
                { $setOnInsert: { email: userEmail, name: userName || 'User' } },
                { upsert: true, new: true }
            );

            const prefs = user?.emailPrefs || {};
            if (prefs.highScoreAlerts === false) return; // opted out

            const isHigh = (
                (questionnaireType === 'PHQ-9' && totalScore >= (parseInt(process.env.PHQ9_HIGH || '15', 10))) ||
                (questionnaireType === 'GAD-7' && totalScore >= (parseInt(process.env.GAD7_HIGH || '15', 10)))
            );

            if (isHigh) {
                const html = `
                  <div style="font-family:Arial,sans-serif">
                    <h3>Heads up about your recent ${questionnaireType} score</h3>
                    <p>Hi ${user.name || 'there'},</p>
                    <p>Your recent assessment score was <b>${totalScore}</b>, which may indicate elevated symptoms.</p>
                    <p>This email is informational and not a diagnosis. If you're struggling, consider reaching out to a trusted professional or support line in your area.</p>
                    <p>We're here for you,<br/>Bloomence Team</p>
                  </div>`;
                await sendEmail(user.email || userEmail, `${questionnaireType} alert: elevated score`, html);
                // Realtime event: high score alert
                try {
                    const io = req.app.get('io');
                    if (io) {
                        io.to(firebaseUid).emit('result:highScoreAlert', {
                            questionnaireType,
                            totalScore
                        });
                        io.to(firebaseUid).emit('email:sent', {
                            kind: 'highScoreAlert',
                            to: user.email || userEmail
                        });
                    }
                } catch (_) { }
            }
        } catch (e) {
            console.error('high-score email error', e);
        }

    } catch (err) {
        console.error("Error saving result:", err);
        res.status(500).json({ message: 'Error saving result to database.' });
    }
});

// Route to fetch a user's dashboard data
// GET /api/results/dashboard
router.get('/dashboard', async (req, res) => {
    // 🟢 CRITICAL: Fetch data using the authenticated user's UID
    const firebaseUid = req.user.uid;

    try {
        const results = await Result.find({ firebaseUid: firebaseUid })
            .sort({ createdAt: 1 }) // Order by date chronologically
            .exec();

        res.status(200).json(results);

    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: 'Error fetching results from database.' });
    }
});

module.exports = router;