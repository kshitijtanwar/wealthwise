const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

const sendResetEmail = async (to, resetUrl) => {
    const info = await transporter.sendMail({
        from: "Wealthwise <no-reply@wealthwise.com>",
        to,
        subject: "Password reset request",
        html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `,
    });

    console.log("Message sent: %s", info.messageId);
};

module.exports = { sendResetEmail };
