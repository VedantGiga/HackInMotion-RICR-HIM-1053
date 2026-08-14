import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, code: string) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || "service_dvicy8b";
  const templateId = process.env.EMAILJS_TEMPLATE_ID || "template_ii8om4m";
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || "JtOjDhYRDchP6rMsp";
  const privateKey = process.env.EMAILJS_PRIVATE_KEY || "3DBluqZ82gt07QMd7TYP9";

  // 1. Try sending via EmailJS REST API
  if (serviceId && templateId && publicKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          ...(privateKey ? { accessToken: privateKey } : {}),
          template_params: {
            to_email: email,
            email: email,
            user_email: email,
            recipient_email: email,
            passcode: code,
            code: code,
            otp: code,
            expires_in: "10 minutes",
            company_name: "Koshin AI",
            logo_url: "https://koshin.ai/klogofinal.png",
          },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`[EmailJS] Verification email sent successfully to ${email}`);
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error(`[EmailJS Error ${response.status}]:`, errorText);
      }
    } catch (err: any) {
      console.error("[EmailJS] Network/Timeout error:", err?.message || err);
    }
  }

  // 2. Fallback to Nodemailer if SMTP configuration is present
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const from = process.env.SMTP_FROM || "noreply@koshin.ai";
      const subject = "Your Koshin Verification Code";
      const html = `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0b0d10; padding: 40px 30px; border-radius: 20px; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8b5cf6; font-size: 28px; font-weight: 800; margin: 0;">KOSHIN</h1>
            <p style="color: #8e8e93; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">Smart Financial Intelligence</p>
          </div>
          <div style="background: #14161b; border: 1px solid #2e2e2e; padding: 30px; border-radius: 16px; text-align: center;">
            <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 10px 0;">Verify Your Email Address</h2>
            <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 25px 0;">Enter this code to complete your verification and access your Koshin account:</p>
            <div style="background: #0b0d10; border: 2px dashed #8b5cf6; padding: 18px; border-radius: 12px; display: inline-block; width: 80%; margin: 0 auto;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #00e5ff; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #8e8e93; font-size: 12px; margin-top: 20px;">⏱️ This code will expire in 10 minutes.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({ from, to: email, subject, html });
      return { success: true };
    } catch (err: any) {
      console.error("[SMTP Error]:", err?.message);
    }
  }

  // 3. Console log fallback
  console.log(`[VERIFICATION CODE FOR ${email}]: ${code}`);
  return { success: true };
}
