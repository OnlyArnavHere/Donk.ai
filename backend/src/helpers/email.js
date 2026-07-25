import { env } from '../config/env.js';

/**
 * Email service — placeholder implementation.
 * In production, replace with a real SMTP provider (Nodemailer, SendGrid, AWS SES, etc.)
 */

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.emailHost) {
    // Development mode: log to console instead of sending
    console.info('\n========== EMAIL (DEV MODE) ==========');
    console.info(`To: ${to}`);
    console.info(`Subject: ${subject}`);
    console.info(`Body: ${text || html}`);
    console.info('======================================\n');
    return { sent: false, dev: true };
  }

  // Production: integrate with real SMTP provider here
  // Example with nodemailer:
  // const transporter = nodemailer.createTransport({
  //   host: env.emailHost,
  //   port: env.emailPort,
  //   auth: { user: env.emailUser, pass: env.emailPass },
  // });
  // await transporter.sendMail({ from: env.emailFrom, to, subject, html, text });

  console.warn('[Email] SMTP configured but transporter not implemented');
  return { sent: false };
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${env.clientOrigin}/reset-password?token=${resetToken}`;
  const html = `
    <h2>Reset your DunkAI password</h2>
    <p>Click the link below to reset your password. This link expires in ${env.resetTokenExpiry} minutes.</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  return sendEmail({ to: email, subject: 'DunkAI — Password Reset', html });
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const verifyUrl = `${env.clientOrigin}/verify-email?token=${verificationToken}`;
  const html = `
    <h2>Verify your DunkAI email</h2>
    <p>Click the link below to verify your email address.</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `;
  return sendEmail({ to: email, subject: 'DunkAI — Verify Your Email', html });
};
