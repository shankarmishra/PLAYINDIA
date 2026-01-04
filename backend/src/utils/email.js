const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;

// Create nodemailer transporter only if SMTP credentials are provided
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Verify transporter
  transporter.verify()
    .then(() => logger.info('SMTP connection established successfully'))
    .catch(error => logger.error('SMTP connection error:', error));
} else {
  logger.info('SMTP not configured - Email functionality disabled');
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<Object>} Nodemailer response
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!transporter) {
      logger.warn('Email not sent - SMTP not configured');
      return { success: false, message: 'SMTP not configured' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (user) => {
  if (!transporter) {
    return { success: false, message: 'SMTP not configured' };
  }

  const subject = 'Welcome to PlayIndia!';
  const text = `Hello ${user.name},

Welcome to PlayIndia - India's Premier Sports Network!

We're excited to have you join our community of sports enthusiasts.

Best regards,
The PlayIndia Team`;
  const html = `
    <h1>Welcome to PlayIndia!</h1>
    <p>Hello ${user.name},</p>
    <p>Welcome to <strong>PlayIndia</strong> - India's Premier Sports Network!</p>
    <p>We're excited to have you join our community of sports enthusiasts.</p>
    <br>
    <p>Best regards,<br>The PlayIndia Team</p>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  if (!transporter) {
    return { success: false, message: 'SMTP not configured' };
  }

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `Hello ${user.name},

You requested a password reset. Click this link to reset your password:
${resetUrl}

This link expires in 1 hour.

If you didn't request this, please ignore this email.`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.name},</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00B8D4; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail({ to: user.email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
