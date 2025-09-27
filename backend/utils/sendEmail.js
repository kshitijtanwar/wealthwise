const nodemailer = require("nodemailer")


 

const transporter = nodemailer.createTransport({

    host: "sandbox.smtp.mailtrap.io",

    port: 2525,

    auth: {

        user: process.env.MAILTRAP_USER,

        pass: process.env.MAILTRAP_PASS,

    }

})



 

const sendResetEmail = async (to, resetUrl) => {

    const info = await transporter.sendMail({

        from: 'wealthwise<no-reply@wealthwise.com>',

        to,

        subject: "Password reset request",

        html: `

        <p>You requested password reset.</p>

        <p>Click here to reset: <a href="${resetUrl}">${resetUrl}</a></p>

        `

    })

}


 

module.exports = { sendResetEmail }