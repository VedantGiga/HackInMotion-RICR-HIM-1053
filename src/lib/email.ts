import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  const from = process.env.SMTP_FROM || "noreply@koshin.ai";
  const subject = "Your Koshin Verification Code";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #141414;">Verify your email address</h2>
      <p style="color: #666666;">Use the following 6-digit code to complete your signup to Koshin:</p>
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #141414;">${code}</span>
      </div>
      <p style="color: #666666;">This code will expire in 10 minutes.</p>
      <p style="color: #666666; font-size: 12px; margin-top: 40px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: email,
    subject,
    html,
  });
}
