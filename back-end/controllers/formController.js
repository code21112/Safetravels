// // const sgMail = require('@sendgrid/mail')
// // sgMail.setApiKey(process.env.SENDGRID_APIKEY)

// // FOR SENDINBLUE
// // const SibApiV3Sdk = require('sib-api-v3-sdk');
// // SibApiV3Sdk.setApiKey(process.env.SENDINBLUE_APIKEY)


// // FOR MAILGUN
// const DOMAIN = 'sandboxdac69502ff6d4777ad35f19a09352436.mailgun.org';
// const mailgun = require('mailgun-js');

// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

// // exports.contactForm = (req, res) => {
// //     res.send('contact endpoint')
// //     // const data = req.body
// //     const { email, name, message } = req.body

// //     // console.log(data)

// //     const emailData = {
// //         to: process.env.EMAIL_TO,
// //         from: req.body.email,
// //         subject: `${process.env.APP_NAME} - Contact form - `,
// //         text: `Email received from contact form: \n Sender name: ${name} \n Sender email: ${email} \n Message: ${message}`,
// //         html: `
// //         <h4>Email received from contact from:</h4>
// //         <p>Sender name: ${name}</p>
// //         <p>Sender email: ${email}</p>
// //         <p>Sender message: ${message}</p>
// //         <hr/>
// //         <p>This email may contain sensitive information</p>
// //         `
// //     }
// // };


// const emailData = {
//     to: process.env.EMAIL_TO,
//     from: req.body.email,
//     subject: `${process.env.APP_NAME} - Contact form - `,
//     text: `Email received from contact form: \n Sender name: ${name} \n Sender email: ${email} \n Message: ${message}`,
//     html: `
//             <h4>Email received from contact from:</h4>
//             <p>Sender name: ${name}</p>
//             <p>Sender email: ${email}</p>
//             <p>Sender message: ${message}</p>
//             <hr/>
//             <p>This email may contain sensitive information</p>
//             `
// }

// // sgMail.send(emailData).then((err, data) => {
// //     return res.json({
// //         success: true
// //     })
// // })

// mailgun.messages().send(emailData, function (error, body) {
//     console.log(body)
//     return res.json({
//         success: true
//     })
// })



// FOR NODEMAILER

exports.contactForm = (req, res) => {
    res.send('contact endpoint')
    // const data = req.body
    const { email, name, message } = req.body

    // console.log(data)

    const emailData = {
        to: process.env.EMAIL_TO,
        from: req.body.email,
        subject: `${process.env.APP_NAME} - Contact form - `,
        text: `Email received from contact form: \n Sender name: ${name} \n Sender email: ${email} \n Message: ${message}`,
        html: `
            <h4>Email received from contact from:</h4>
            <p>Sender name: ${name}</p>
            <p>Sender email: ${email}</p>
            <p>Sender message: ${message}</p>
            <hr/>
            <p>This email may contain sensitive information</p>
            `
    }
};
