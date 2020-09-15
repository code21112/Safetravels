const nodemailer = require('nodemailer');

const sendEmail = options => {
    // 1 Creating transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // 2 Activating the less secure app in Gmail

    })
    // 3 Defining options

    // 4 Sending email
}
