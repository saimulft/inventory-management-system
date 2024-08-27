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
            from: "alert@saimul-islam.com",
            to: email,
            subject: subject,
            html: html
        }

        await transporter.sendMail(mailOption)

    }
    catch (error) {
        console.log(error)
        throw new Error('Nodemailer error');
    }
}


module.exports = sendEmail;