
import nodemailer from 'nodemailer';
let brevo = null;
if (process.env.NODE_ENV === 'production') {
  brevo = await import('@getbrevo/brevo');
}

function getTransporter() {
  if (process.env.NODE_ENV === 'production') {
    // Brevo will be used directly in sendOtpEmail
    return null;
  }
  const service = process.env.EMAIL_SERVICE;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!service || !user || !pass) {
    throw new Error('Email service configuration is missing');
  }
  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });
}


async function sendOtpEmail(to, otp, type = 'register') {
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve();
  }
  let subject, html;
  const logoUrl = `${process.env.CLIENT_URL || ''}/assets/email/logo.png`;
  if (type === 'register') {
    subject = 'Still Hungry Verification Code';
    html = `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;border:1px solid #eee;padding:24px;border-radius:8px;background:#fff;">
        <div style="font-size:2em;font-weight:bold;text-align:center;margin-bottom:16px;color:#222;">STILLHUNGRY</div>
        <h2 style="color:#ff5722;text-align:center;">Official Verification Service</h2>
        <h3 style="text-align:center;">Confirm Your Email</h3>
        <p>Hello! Welcome to the family. To finish setting up your account and start ordering, please use the 6-digit verification code below:</p>
        <div style="font-size:2em;text-align:center;font-weight:bold;color:#222;margin:24px 0;">${otp}</div>
      </div>
    `;
  } else if (type === 'reset') {
    subject = 'Reset your Still Hungry Password';
    html = `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;border:1px solid #eee;padding:24px;border-radius:8px;background:#fff;">
        <div style="font-size:2em;font-weight:bold;text-align:center;margin-bottom:16px;color:#222;">STILLHUNGRY</div>
        <h2 style="color:#ff5722;text-align:center;">Official Verification Service</h2>
        <h3 style="text-align:center;">Reset Your Password</h3>
        <p>To reset your password, please use the 6-digit code below:</p>
        <div style="font-size:2em;text-align:center;font-weight:bold;color:#222;margin:24px 0;">${otp}</div>
      </div>
    `;
  }

  if (process.env.NODE_ENV === 'production') {
    // Use Brevo (Sendinblue)
    if (!process.env.BREVO_API_KEY) {
      throw new Error('Brevo API key is missing');
    }
    const BrevoApi = brevo.default;
    const apiInstance = new BrevoApi.TransactionalEmailsApi();
    apiInstance.setApiKey(BrevoApi.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: { email: process.env.EMAIL_USER || 'no-reply@stillhungry.com', name: 'StillHungry' },
      subject,
      htmlContent: html,
    };
    return apiInstance.sendTransacEmail(sendSmtpEmail);
  } else {
    // Use Nodemailer for dev/test
    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@stillhungry.com',
      to,
      subject,
      html,
    };
    return transporter.sendMail(mailOptions);
  }
}

export { sendOtpEmail };
