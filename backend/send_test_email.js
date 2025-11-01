require('dotenv').config();
const { sendEmail } = require('./utils/mailer');

(async () => {
  try {
    console.log('SMTP host/port from .env:', process.env.SMTP_HOST, process.env.SMTP_PORT);
    const to = process.argv[2] || process.env.TEST_EMAIL_TO;
    if (!to) {
      console.error('Usage: node send_test_email.js <recipient_email>  (or set TEST_EMAIL_TO in .env)');
      process.exit(1);
    }
    const info = await sendEmail(to, 'SMTP test from Bloomence', '<b>Hello from Bloomence backend</b>');
    console.log('Email sent:', info && (info.messageId || info.response || JSON.stringify(info)));
  } catch (e) {
    console.error('Send failed:', e);
    process.exit(1);
  }
})();
