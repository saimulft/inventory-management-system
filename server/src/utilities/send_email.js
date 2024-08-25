const nodemailer = require('nodemailer')

const sendEmail = async (transporter_data) => {
    const { email, subject, html } = transporter_data
    try {
        const transporter =
            nodemailer.createTransport({
                host: "mail.saimul-islam.com",
                port: 465,
                secure: true,
                requireTLS: true,
                auth: {
                    user: "alert@saimul-islam.com",
                    pass: 'Sa27111996!'
                }
            })

        const mailOption = {
            from: "alert@developerlook.net",
            to: email,
            subject: subject,
            html: html
        }

        await transporter.sendMail(mailOption)

    }
    catch (error) {
        res.status(500).json({ message: 'Nodemailer error' });
    }
}


module.exports = sendEmail;