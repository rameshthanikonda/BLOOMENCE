const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL || user;
const fromName = process.env.FROM_NAME || 'Bloomence';

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }
  return transporter;
}

async function sendEmail(to, subject, html, text) {
  const t = getTransporter();
  const info = await t.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ' '),
    html,
  });
  return info;
}

module.exports = { sendEmail };
