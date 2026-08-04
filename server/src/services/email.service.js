const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

let transporter = null;

if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  logger.info('Nodemailer SMTP Transporter configured.');
} else {
  logger.warn('Nodemailer SMTP configuration is missing. Emails will be printed to console logs for development.');
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${env.EMAIL_FROM.split('@')[0]}" <${env.EMAIL_FROM}>`,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Error sending email to ${to}: ${error.message}`);
      return null;
    }
  } else {
    logger.info(`
============================================================
[SIMULATED EMAIL DISPATCH]
To: ${to}
Subject: ${subject}
Text: ${text}
HTML: ${html.substring(0, 500)}... (truncated)
============================================================
    `);
    return { messageId: 'simulated-id-' + Date.now() };
  }
};

const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${env.CLIENT_URL}/auth/verify-email?token=${token}`;
  const subject = 'Verify Your Email - JobConnect';
  const text = `Hi ${name},\n\nPlease verify your email by clicking the following link: ${verifyUrl}`;
  const html = `
    <h3>Hi ${name},</h3>
    <p>Thank you for registering on JobConnect. Please click the button below to verify your email address:</p>
    <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
    <p>Or copy and paste this link in your browser:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `;
  return await sendEmail({ to, subject, html, text });
};

const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${env.CLIENT_URL}/auth/reset-password?token=${token}`;
  const subject = 'Reset Your Password - JobConnect';
  const text = `You requested a password reset. Click this link: ${resetUrl}`;
  const html = `
    <h3>Reset Your Password</h3>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#008CBA;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>Or copy and paste this link in your browser:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link is valid for 1 hour.</p>
  `;
  return await sendEmail({ to, subject, html, text });
};

const sendApplicationStatusEmail = async (to, candidateName, jobTitle, companyName, status, notes = '') => {
  const subject = `Application Status Update: ${jobTitle} at ${companyName}`;
  const text = `Hi ${candidateName},\n\nYour application status for ${jobTitle} at ${companyName} has been updated to: ${status}.`;
  const html = `
    <h3>Hi ${candidateName},</h3>
    <p>Your application status for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:</p>
    <h2 style="color:#333;">${status}</h2>
    ${notes ? `<p><strong>Recruiter Notes:</strong> ${notes}</p>` : ''}
    <p>Log in to your dashboard to view more details.</p>
  `;
  return await sendEmail({ to, subject, html, text });
};

const sendInterviewScheduledEmail = async (to, candidateName, jobTitle, companyName, scheduledAt, mode, locationUrl, notes = '') => {
  const dateStr = new Date(scheduledAt).toLocaleString();
  const subject = `Interview Scheduled: ${jobTitle} at ${companyName}`;
  const text = `Hi ${candidateName},\n\nAn interview has been scheduled for ${jobTitle} at ${companyName}.\nTime: ${dateStr}\nMode: ${mode}\nLink/Location: ${locationUrl}`;
  const html = `
    <h3>Hi ${candidateName},</h3>
    <p>An interview has been scheduled for your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
    <ul>
      <li><strong>Date & Time:</strong> ${dateStr}</li>
      <li><strong>Mode:</strong> ${mode}</li>
      <li><strong>Link/Location:</strong> <a href="${locationUrl}">${locationUrl}</a></li>
    </ul>
    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    <p>Please log in to your candidate dashboard to accept or view details.</p>
  `;
  return await sendEmail({ to, subject, html, text });
};

const sendCompanyVerificationEmail = async (to, companyName, isVerified, rejectionReason = '') => {
  const subject = `Company Verification status - JobConnect`;
  const statusStr = isVerified ? 'Verified' : 'Rejected';
  const text = `Hi,\n\nYour company profile for ${companyName} has been ${statusStr.toLowerCase()}.\n${rejectionReason ? `Reason: ${rejectionReason}` : ''}`;
  const html = `
    <h3>Hello,</h3>
    <p>Your company profile for <strong>${companyName}</strong> has been evaluated by the JobConnect admin team.</p>
    <p>Status: <strong style="color: ${isVerified ? 'green' : 'red'};">${statusStr}</strong></p>
    ${rejectionReason ? `<p><strong>Reason for rejection:</strong> ${rejectionReason}</p>` : ''}
    ${isVerified ? '<p>You can now log in and start posting jobs!</p>' : '<p>Please edit your profile details and submit again.</p>'}
  `;
  return await sendEmail({ to, subject, html, text });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendApplicationStatusEmail,
  sendInterviewScheduledEmail,
  sendCompanyVerificationEmail,
};
