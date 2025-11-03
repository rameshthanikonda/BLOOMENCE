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

            // Send combined PHQ/GAD email once both are available and newer than last sent
            try {
                const latestPHQ = await Result.findOne({ firebaseUid, questionnaireType: 'PHQ-9' }).sort({ createdAt: -1 }).lean();
                const latestGAD = await Result.findOne({ firebaseUid, questionnaireType: 'GAD-7' }).sort({ createdAt: -1 }).lean();
                if (latestPHQ && latestGAD) {
                    const latestBothAt = new Date(Math.max(new Date(latestPHQ.createdAt).getTime(), new Date(latestGAD.createdAt).getTime()));
                    const alreadySentAt = user.combinedScoresEmailedAt ? new Date(user.combinedScoresEmailedAt) : null;
                    if (!alreadySentAt || latestBothAt > alreadySentAt) {
                        const appUrl = process.env.APP_URL || 'http://localhost:5173';
                        const phqIcon = latestPHQ.totalScore >= 15 ? '🌧️' : latestPHQ.totalScore >= 10 ? '🌥️' : '🌤️';
                        const gadIcon = latestGAD.totalScore >= 15 ? '🌧️' : latestGAD.totalScore >= 10 ? '🌥️' : '🌤️';
                        const htmlCombined = `
                          <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
                            <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
                              <div style="text-align:center;font-size:28px;">🌿 <span style="color:#10b981; font-weight:700;">Bloomence</span></div>
                              <h2 style="color:#111827;">Your recent wellbeing check-in</h2>
                              <p style="color:#374151;">Hi ${user.name || 'there'}, here are your latest scores:</p>
                              <div style="display:flex;gap:12px;align-items:center;margin:12px 0;">
                                <div style="flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:12px;">
                                  <div style="font-weight:600;color:#111827;">PHQ‑9</div>
                                  <div style="font-size:24px;">${phqIcon} <b>${latestPHQ.totalScore}</b></div>
                                </div>
                                <div style="flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:12px;">
                                  <div style="font-weight:600;color:#111827;">GAD‑7</div>
                                  <div style="font-size:24px;">${gadIcon} <b>${latestGAD.totalScore}</b></div>
                                </div>
                              </div>
                              <p style="color:#6b7280;">These results are informational and not a diagnosis.</p>
                              <div style="margin-top:16px;">
                                <a href="${appUrl}" style="background:#10b981;color:#ffffff;padding:10px 16px;border-radius:8px;text-decoration:none;">Open Bloomence</a>
                              </div>
                              <p style="color:#6b7280;margin-top:24px;">With care,<br/>Bloomence Team</p>
                            </div>
                          </div>`;
                        await sendEmail(user.email || userEmail, 'Your PHQ‑9 and GAD‑7 summary', htmlCombined);
                        await User.updateOne(
                          { firebaseUid },
                          { $set: { combinedScoresEmailedAt: latestBothAt } }
                        );
                        try {
                          const io = req.app.get('io');
                          if (io) io.to(firebaseUid).emit('email:sent', { kind: 'combinedResults', to: user.email || userEmail });
                        } catch (_) { }
                    }
                }
            } catch (e) {
                console.error('combined results email error', e);
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