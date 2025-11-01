// backend/routes/gemini.js

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Result = require('../models/Result'); // 🟢 FIX: Ensure Result model is imported
const router = express.Router();
require('dotenv').config();

// Initialize Gemini client using environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not defined. BloomBot responses will fail until it is provided.');
}
const genAI = new GoogleGenerativeAI(apiKey || '');
let RESOLVED_MODEL = null;
const conversationHistory = new Map();

// --- Helper Function: Fetch scores securely ---
// This function relies on the fact that the request has ALREADY passed checkAuth 
const fetchScoresForBot = async (uid) => {
    try {
        const results = await Result.find({ firebaseUid: uid })
            .sort({ createdAt: -1 }) // Get latest results first
            .limit(20)
            .exec();
        // Extract latest PHQ9 and GAD7 scores
        const latestPHQ9Score = results.find(r => r.questionnaireType === 'PHQ-9')?.totalScore || 0;
        const latestGAD7Score = results.find(r => r.questionnaireType === 'GAD-7')?.totalScore || 0;

        return { latestPHQ9Score, latestGAD7Score };
    } catch (e) {
        console.error("DB Fetch Error:", e);
        return { latestPHQ9Score: 0, latestGAD7Score: 0 };
    }
}

const listModels = async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`listModels failed: ${r.status}`);
    return (await r.json())?.models || [];
};

const chooseModel = async () => {
    if (RESOLVED_MODEL) return RESOLVED_MODEL;
    // Allow manual override
    if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim()) {
        RESOLVED_MODEL = process.env.GEMINI_MODEL.trim();
        return RESOLVED_MODEL;
    }
    const models = await listModels();
    // Exclude experimental and 2.5 models for free tier reliability
    const isAllowed = (m) => {
        const id = m.name?.split('/').pop() || '';
        if (/2\.5|exp/i.test(id)) return false;
        return Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent');
    };
    const available = models.filter(isAllowed).map(m => m.name.split('/').pop());
    const prefer = ['gemini-1.5-flash', 'gemini-1.5-flash-001', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro'];
    let found = prefer.find(p => available.includes(p)) || available[0];
    if (!found) throw new Error('No supported Gemini model available for this API key');
    RESOLVED_MODEL = found;
    return RESOLVED_MODEL;
};

const callGenerateContent = async (promptText) => {
    const model = await chooseModel();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
        contents: [ { role: 'user', parts: [ { text: promptText } ] } ]
    };
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
        const t = await r.text();
        // Surface friendlier message for quota/rate limit
        if (r.status === 429) {
            throw new Error('The free Gemini quota was exceeded. Please wait a bit and try again, or set a billing-enabled API key.');
        }
        throw new Error(`generateContent ${r.status}: ${t}`);
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
};


// Route to handle chat interactions
// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
    // 
    const firebaseUid = req.user.uid;
    const userName = req.user.displayName || 'Friend'; // Assuming displayName is available from token
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: 'Prompt is required.' });
    }

    if (!apiKey) {
        return res.status(500).json({
            response: "BloomBot configuration error: missing GEMINI_API_KEY on the server.",
            error: 'GEMINI_API_KEY not set',
        });
    }

    let promptToSend = prompt;

    // 1. Check if this is the initial session (user's first message to the bot)
    if (prompt.includes('PHQ-9 (Depression):')) {
        const { latestPHQ9Score, latestGAD7Score } = await fetchScoresForBot(firebaseUid);
        promptToSend = `Generate a response for a user named ${userName} who just opened the wellness bot.
Their latest assessment results are: PHQ-9 (Depression): ${latestPHQ9Score}/27 and GAD-7 (Anxiety): ${latestGAD7Score}/21.
Provide a compassionate summary, and a list of 5 suggestions covering: Nutrition, Brain Health, Sleep Cycle, and Overall Condition Improvement.
The tone must remain encouraging and never diagnostic.`;
    }

    try {
        const previousHistory = conversationHistory.get(firebaseUid) || [];
        const systemInstruction = "You are BloomBot, an expert wellness coach. Your responses must be kind and non-judgmental. Do NOT provide medical diagnoses. Maintain conversation history. FORMAT: Write concise sentences. Put each sentence on a new line. Do not use numbering or bullets. Keep sentences short. Use **bold** for key terms when helpful.";
        const finalPrompt = `${systemInstruction}\n\nUser: ${promptToSend}`;
        const botResponseText = await callGenerateContent(finalPrompt);

        if (!botResponseText) {
            throw new Error('Gemini returned an empty response.');
        }

        const updatedHistory = [
            ...previousHistory.slice(-18),
            { role: 'user', parts: [{ text: promptToSend }] },
            { role: 'model', parts: [{ text: botResponseText }] },
        ];

        conversationHistory.set(firebaseUid, updatedHistory);

        res.status(200).json({ response: botResponseText });

    } catch (error) {
        console.error("Gemini API Error:", error);
        let detail = error?.message || 'Unknown error';
        if (error?.response && typeof error.response.text === 'function') {
            try {
                detail = await error.response.text();
            } catch (readErr) {
                detail = `${detail}; response text read failed: ${readErr.message}`;
            }
        }

        const status = error?.status || error?.response?.status || 500;
        res.status(status).json({
            response: "I'm sorry, I encountered an error connecting to the AI service.",
            error: detail,
        });
    }
});

// --- Streaming chat via Server-Sent Events (SSE) ---
// POST /api/gemini/chat-stream
router.post('/chat-stream', async (req, res) => {
    const firebaseUid = req.user.uid;
    const userName = req.user.displayName || 'Friend';
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: 'Prompt is required.' });
    }
    if (!apiKey) {
        return res.status(500).json({ message: 'GEMINI_API_KEY not set' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let closed = false;
    req.on('close', () => { closed = true; });

    try {
        let promptToSend = prompt;
        if (prompt.includes('PHQ-9 (Depression):')) {
            const { latestPHQ9Score, latestGAD7Score } = await fetchScoresForBot(firebaseUid);
            promptToSend = `Generate a response for a user named ${userName} who just opened the wellness bot.\nTheir latest assessment results are: PHQ-9 (Depression): ${latestPHQ9Score}/27 and GAD-7 (Anxiety): ${latestGAD7Score}/21.\nProvide a compassionate summary, and a list of 5 suggestions covering: Nutrition, Brain Health, Sleep Cycle, and Overall Condition Improvement.\nThe tone must remain encouraging and never diagnostic.`;
        }

        const systemInstruction = "You are BloomBot, an expert wellness coach. Your responses must be kind and non-judgmental. Do NOT provide medical diagnoses. Maintain conversation history. FORMAT: Answer as concise numbered points (1., 2., 3., ...). Keep each point to 1–2 short sentences. Use **bold** for key terms when helpful. Do not write long paragraphs.";
        const finalPrompt = `${systemInstruction}\n\nUser: ${promptToSend}`;
        const botResponseText = await callGenerateContent(finalPrompt);
        if (!botResponseText) {
            res.end();
            return;
        }
        // Stream in small chunks (words) for a real-time feel
        const words = botResponseText.split(/(\s+)/); // keep spaces
        let i = 0;
        const timer = setInterval(() => {
            if (closed) {
                clearInterval(timer);
                try { res.end(); } catch (_) {}
                return;
            }
            if (i >= words.length) {
                clearInterval(timer);
                res.end();
                return;
            }
            const piece = words[i++];
            if (piece) {
                res.write(`data: ${piece}` + "\n\n");
            }
        }, 20);
    } catch (error) {
        if (!res.headersSent) res.status(500);
        try { res.write(`data: [ERROR] ${error?.message || 'Unknown error'}\n\n`); } catch (_) {}
        res.end();
    }
});

// GET /models route to return available models and the resolved model name
router.get('/models', async (req, res) => {
    try {
        const models = await listModels();
        const resolvedModel = await chooseModel();
        res.status(200).json({ models, resolvedModel });
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

module.exports = router;