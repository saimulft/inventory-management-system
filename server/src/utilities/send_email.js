const nodemailer = require('nodemailer')

const sendEmail = async (transporter_data) => {
    const { email, subject, html } = transporter_data
    try {
        const transporter =
            nodemailer.createTransport({
                host: "smtp.titan.email",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "alert@developerlook.net",
                    pass: 'AlphaK7!jSA'
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