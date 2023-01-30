const nodemailer = require('nodemailer');

const sendEMessage = (subject, body, email) => {
    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_SENDER_EMAIL,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                refreshToken: process.env.MAIL_REFRESH_TOKEN,
                accessToken: process.env.MAIL_ACCESS_TOKEN
            }
        });
        var mailOptions = {
            from: `${process.env.MAIL_SENDER_NAME} <${process.env.MAIL_SENDER_EMAIL}>`,
            to: email,
            subject: subject,
            html: body
        };
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error, 'error in mail')
                return Promise.reject(error);
            } else {
                return resolve({ sent: true });
            }
        });

    });
};


module.exports = {
    sendEMessage
}