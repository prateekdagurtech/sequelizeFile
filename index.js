require("dotenv").config();
const express = require('express')
const passport = require('passport')
require('./email/mail')
const bodyParser = require('body-parser')
const userRouters = require('./routes/users')
let app = express()
require('./database/sequelize');
const port = process.env.PORT || 3000
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRouters)
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
require('./middleware/passport').passport


// const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = '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'
// console.log('11111111111')
// sgMail.setApiKey(sendgridAPIKey)

// const msg = {

//     to: email,
//     from: 'prateekdagur8@gmail.com',
//     subject: 'Sending with SendGrid',
//     text: 'user has been created',

// }
// console.log('111111111111111')
// console.log(msg)
// sgMail.send(msg)
//     .then((aaaa) => {
//         console.log('Email sent', '111111111111111111111111111111111111')
//         console.log(aaaa)
//     })
//     .catch((error) => {
//         console.error(error)
//     })



app.listen(port, () => console.log(`Express server currently running on port ${port}`))