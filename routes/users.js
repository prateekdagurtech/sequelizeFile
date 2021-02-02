const express = require('express')
const passport = require('passport')
const UsersModel = require('../models/user')
const userAuthentication = require('../middleware/auth')
const UsersAccessToken = require('../models/access_token')
const forgotToken = require('../models/forgot_token')
const UsersAddress = require('../models/address')
const bcrypt = require('bcrypt');
const randToken = require('rand-token')
const saltRounds = 10;
const router = express.Router()
const sgMail = require('@sendgrid/mail')


const sendgridAPIKey = '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'
sgMail.setApiKey(sendgridAPIKey)
const sendGridMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'prateekdagur8@gmail.com',
        subject: 'Sending with SendGrid',
        text: `user ${name} has been created`,

    })
}

const sendGridMailUpdate = (email, username) => {
    sgMail.send({
        to: email,
        from: 'prateekdagur8@gmail.com',
        subject: 'Sending with SendGrid',
        text: `hii ${username} your account is updated`

    })
}
const sendGridForgotPassword = (email, link) => {
    sgMail.send({
        to: email,
        from: 'prateekdagur8@gmail.com',
        subject: 'Sending with SendGrid',
        text: 'click on this link to reset the password',
        html: link

    })
}
const sendGridResetPassword = (email, name) => {
    sgMail.send({
        to: email,
        from: 'prateekdagur8@gmail.com',
        subject: 'Sending with SendGrid',
        text: `hii ${name} your password has been updated successfully`,

    })
}
router.post('/register', async function (req, res) {
    try {
        if (!req.body.password) {
            res.send({ message: "please provide password" })
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.hash = hash
        req.body.salt = salt
        let createUser = await UsersModel.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.hash,
            salt: req.body.salt,
            address: req.body.address
        });
        sendGridMail(createUser.email, createUser.firstname)
        res.send(createUser)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})
router.post('/address', userAuthentication.auth, async (req, res) => {
    try {
        const createAddress = await UsersAddress.create({
            address: req.body.address,
            userId: req.user.user_id
        });
        res.send(createAddress)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/address', userAuthentication.auth, async (req, res) => {
    try {
        user_id = req.user.user_id
        var userData = await UsersModel.findAll({
            include: [
                {
                    model: UsersAddress, as: "addresses"
                }
            ]
        });
        res.send(userData);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const user_id = req.params.id
        const deleteUser = await UsersModel.destroy({ where: { "id": user_id } })
        const deleteAddress = await UsersAddress.destroy({ where: { "id": user_id } })
        const deleteAccessToken = await UsersAccessToken.destroy({ where: { "user_id": user_id } })
        res.json({ message: 'user deleted' })
    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.patch('/update/:id', async (req, res) => {
    try {
        const user_id = req.params.id
        const createUpdate = await UsersModel.update(
            { firstname: req.body.firstname, lastname: req.body.lastname }, { where: { "id": user_id } })
        const users = await UsersModel.findOne({ where: { "id": user_id } })
        sendGridMailUpdate(users.email, users.username)
        res.json({ message: 'user updated' })
    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.get('/get', async (req, res) => {
    try {
        const users = await UsersModel.findAll()
        res.send(users)
    }
    catch (e) {
        res.status(401).send(e)
    }
})
router.get('/get/page', async function (req, res) {
    try {
        const limit = parseInt(req.query.limit) || 3
        const page = parseInt(req.query.page_no) || 1
        const skip = limit * (page - 1)
        const users = await UsersModel.findAll({ limit: limit, offset: skip });
        res.send(users)
    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.post('/login', passport.authenticate('local', { failureRedirect: 'unsuccess', }), function (req, res, next) {
    res.redirect('success');
})
router.get('/success', async function (req, res) {
    res.json({
        status: true,
        message: "You are successfully login check token on console"
    })
});
router.get('/unsuccess', function (req, res) {
    res.json({
        status: false,
        message: "unable to login, try again... check username or password"
    })
});
router.post('/forgot', async function (req, res) {
    try {
        const email = req.body.email
        const user = await UsersModel.findAll({ where: { "email": email } })
        console.log(user)
        if (!(user && user.length)) {
            throw new Error("No such email exists")
        }
        const token = randToken.generate(16);
        req.body.token = token
        const createToken = await forgotToken.create({
            resetPasswordToken: req.body.token,
            email: req.body.email
        });

        const link = `${req.protocol}://localhost:3000/user/reset/${createToken.resetPasswordToken}`
        sendGridForgotPassword(createToken.email, link)
        res.json({
            message: `Dear ${user[0].firstname} link has been sent to reset your password`
        })
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
router.post('/reset/:token', async function (req, res) {
    try {
        const forgot = req.params.token
        console.log(forgot)
        const forToken = await forgotToken.findAll({
            where: { "resetPasswordToken": forgot }
        });
        console.log(forToken)
        if (!forToken) {
            throw new Error("No token or has expired")
        }
        if (!req.body.password) {
            res.send({ message: "please provide password" })
        }
        console.log(req.body.password)
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.hash = hash
        console.log(req.body.hash)
        const updatePassword = await UsersModel.update(
            { password: req.body.hash }, { where: { email: req.body.email } })
        const user = await UsersModel.findOne({ where: { "email": req.body.email } })
        sendGridResetPassword(user.email, user.firstname)
        res.json({
            message: 'user has been updated'
        })
    }
    catch (err) {
        res.status(500).send(err.message);

    }
});

module.exports = router
