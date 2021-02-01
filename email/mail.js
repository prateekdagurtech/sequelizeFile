const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)


const msg = {
    to: 'prateekdagur8@gmail.com',
    from: 'abcd@example.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
}

sgMail.send(msg)