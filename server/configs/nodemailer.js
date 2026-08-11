import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
    if (!to) {
        console.warn("[Nodemailer] Warning: Missing recipient email address.");
        return null;
    }
    try {
        const sender = process.env.SENDER_EMAIL || process.env.SMTP_USER || "noreply@hypp.com";
        const response = await transporter.sendMail({
            from: `Hypp Escrow <${sender}>`,
            to,
            subject,
            html,
        });
        console.log(`[Nodemailer] Email successfully sent to ${to} (MessageId: ${response.messageId})`);
        return response;
    } catch (err) {
        console.error(`[Nodemailer] Failed to send email to ${to}:`, err.message);
        return null;
    }
};

export default sendEmail;
