const nodemailer = require('nodemailer')

const sendEmail = async (transporter_data) => {

    const { email, subject, html } = transporter_data
    try {
        const transporter =
            nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "toriqulislam142@gmail.com",
                    pass: 'nqle nukt eqfy kcko'
                }
            })

        const mailOption = {
            from: "toriqulislam142@gamil.com",
            to: email,
            subject: subject,
            html: html
        }

        transporter.sendMail(mailOption)

    }
    catch (error) {
        res.status(500).json({ message: 'Nodemailer error' });
    }
}


module.exports = sendEmail;