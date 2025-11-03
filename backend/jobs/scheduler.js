const cron = require('node-cron');
const Result = require('../models/Result');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

const CRON = process.env.WEEKLY_CRON || '0 9 * * 1'; // 09:00 every Monday
const TZ = process.env.TZ || 'UTC';
const INACTIVITY_CRON = process.env.INACTIVITY_CRON || '0 10 */2 * *'; // every 2 days 10:00
const HIGH_FOLLOWUP_CRON = process.env.HIGH_FOLLOWUP_CRON || '0 11 * * *'; // daily 11:00
const INACTIVITY_DAYS = parseInt(process.env.INACTIVITY_DAYS || '2', 10);
const PHQ9_HIGH = parseInt(process.env.PHQ9_HIGH || '15', 10);
const GAD7_HIGH = parseInt(process.env.GAD7_HIGH || '15', 10);

async function buildWeeklySummary(uid, email, name) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const results = await Result.find({ firebaseUid: uid, createdAt: { $gte: since } }).sort({ createdAt: 1 }).lean();
  if (!results.length) {
    return {
      subject: 'Your weekly wellbeing check-in',
      html: `<div style="font-family:Arial,sans-serif">Hi ${name || 'there'},<br/><br/>No assessments in the last week. Consider taking a quick check-in today.<br/><br/>Stay well,<br/>Bloomence Team</div>`
    };
  }
  const items = results.map(r => `<li>${r.questionnaireType}: <b>${r.totalScore}</b> on ${new Date(r.createdAt).toDateString()}</li>`).join('');
  const byType = results.reduce((acc, r) => {
    acc[r.questionnaireType] = acc[r.questionnaireType] || { sum: 0, n: 0, max: 0 };
    acc[r.questionnaireType].sum += r.totalScore; acc[r.questionnaireType].n += 1; acc[r.questionnaireType].max = Math.max(acc[r.questionnaireType].max, r.totalScore);
    return acc;
  }, {});
  const metrics = Object.entries(byType).map(([k, v]) => `${k}: avg ${(v.sum / v.n).toFixed(1)}, max ${v.max}`).join(' • ');
  const html = `<div style="font-family:Arial,sans-serif">
    <h3>Weekly wellbeing summary</h3>
    <p>Hi ${name || 'there'}, here are your last week results:</p>
    <ul>${items}</ul>
    <p><i>${metrics}</i></p>
    <p>Remember: This is informational and not a diagnosis. If you're concerned, consider reaching out to a professional.</p>
  </div>`;
  return { subject: 'Your weekly wellbeing summary', html };
}

function startWeeklyDigest() {
  cron.schedule(CRON, async () => {
    try {
      const users = await User.find({ 'emailPrefs.weeklyDigest': { $ne: false } }).lean();
      for (const u of users) {
        try {
          const { subject, html } = await buildWeeklySummary(u.firebaseUid, u.email, u.name);
          await sendEmail(u.email, subject, html);
        } catch (e) {
          console.error('weekly digest error for user', u.firebaseUid, e);
        }
      }
    } catch (e) {
      console.error('weekly digest job error', e);
    }
  }, { timezone: TZ });
}

async function getLatestResult(uid) {
  return Result.findOne({ firebaseUid: uid }).sort({ createdAt: -1 }).lean();
}

function isHighScore(r) {
  if (!r) return false;
  if (r.questionnaireType === 'PHQ-9') return r.totalScore >= PHQ9_HIGH;
  if (r.questionnaireType === 'GAD-7') return r.totalScore >= GAD7_HIGH;
  return false;
}

function startInactivityReminders() {
  cron.schedule(INACTIVITY_CRON, async () => {
    try {
      const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
      const throttleCutoff = cutoff; // send at most once per INACTIVITY_DAYS
      const users = await User.find({ 'emailPrefs.reengagementEmails': { $ne: false } }).lean();
      for (const u of users) {
        try {
          const lastSeen = u.lastSeen || u.updatedAt || u.createdAt || new Date(0);
          const lastReengaged = u.lastReengagementSentAt ? new Date(u.lastReengagementSentAt) : new Date(0);
          const shouldSend = new Date(lastSeen) < cutoff && lastReengaged < throttleCutoff;
          if (shouldSend) {
            const appUrl = process.env.APP_URL || 'http://localhost:5173';
            const html = `<div style="font-family:Arial,sans-serif">
              <h3>We miss you at Bloomence</h3>
              <p>Hi ${u.name || 'there'},</p>
              <p>It's been a bit since your last visit. Take a quick 2-minute check-in to see how you're doing today.</p>
              <p><a href="${appUrl}">Open Bloomence</a> to continue your journey.</p>
              <p>With care,<br/>Bloomence Team</p>
            </div>`;
            await sendEmail(u.email, 'It’s been a while — quick check-in?', html);
            await User.updateOne({ firebaseUid: u.firebaseUid }, { $set: { lastReengagementSentAt: new Date() } });
          }
        } catch (e) {
          console.error('inactivity reminder error for user', u.firebaseUid, e);
        }
      }
    } catch (e) {
      console.error('inactivity job error', e);
    }
  }, { timezone: TZ });
}

function startHighScoreFollowups() {
  cron.schedule(HIGH_FOLLOWUP_CRON, async () => {
    try {
      const users = await User.find({ 'emailPrefs.highScoreAlerts': { $ne: false } }).lean();
      for (const u of users) {
        try {
          const last = await getLatestResult(u.firebaseUid);
          if (isHighScore(last)) {
            const when = new Date(last.createdAt).toDateString();
            const html = `<div style="font-family:Arial,sans-serif">
              <h3>Checking in after a high score</h3>
              <p>Hi ${u.name || 'there'},</p>
              <p>On ${when}, your ${last.questionnaireType} score was <b>${last.totalScore}</b>. We wanted to check in with you.</p>
              <p>If you're comfortable, consider taking another assessment to see how you're doing today.</p>
              <p>If you're struggling, support is available — reaching out is a strong step.</p>
            </div>`;
            await sendEmail(u.email, 'A quick check-in from Bloomence', html);
          }
        } catch (e) {
          console.error('high score follow-up error for user', u.firebaseUid, e);
        }
      }
    } catch (e) {
      console.error('high score follow-up job error', e);
    }
  }, { timezone: TZ });
}

function startNotificationsScheduler() {
  startWeeklyDigest();
  startInactivityReminders();
  startHighScoreFollowups();
}

module.exports = { startWeeklyDigest, startNotificationsScheduler };
