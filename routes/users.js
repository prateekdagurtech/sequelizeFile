const express = require('express')
const passport = require('passport')
const UsersModel = require('../models/user')
const userAuthentication = require('../middleware/auth')
const forgotToken = require('../models/forgot_token')
const UsersAddress = require('../models/address')
const bcrypt = require('bcrypt');
const randToken = require('rand-token')
const saltRounds = 10;
const router = express.Router()

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
        res.send(createUser)
    }

    catch (err) {
        res.status(500).send(err.message)
    }
})
router.post('/address', userAuthentication.auth, async (req, res) => {
    try {
        console.log(req.user.user_id);
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
        var userData = await UsersAddress.findAll({
            include: [
                {
                    model: UsersModel, as: "users"
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
        res.json({ message: 'user deleted' })
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

        users = await UsersModel.findAll({ limit: limit, offset: skip });
        res.send(users)
    } catch (e) {
        res.status(401).send(e.message)
    }
});
router.post('/login', passport.authenticate('local', { failureRedirect: 'unsuccess', }), function (req, res, next) {
    res.redirect('success');
})
findByCredentials = async (username, password) => {
    const user = await UsersModel.findOne({ where: { "username": username } })

    if (!user) {
        throw new Error("No such username")
    }
    isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("No any matches of password")
    }
    return user
}
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
        const username = req.body.username
        console.log(username)
        const user = await UsersModel.findAll({ where: { "username": username } })
        console.log(user)
        if (!(user && user.length)) {
            throw new Error("No such username exists")
        }
        const token = randToken.generate(16);

        req.body.token = token
        const createToken = await forgotToken.create({
            resetPasswordToken: req.body.token,
            username: req.body.username
        });
        res.send(createToken)
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/reset', async function (req, res) {
    try {
        const forgot = req.headers.forgottoken
        const forToken = await forgotToken.findAll({
            where: { "resetPasswordToken": forgot }
        });
        console.log(forToken)
        if (!forToken) {
            throw new Error("No token or has expired")
        }
        //  const newPassword = req.body.password
        if (!req.body.password) {
            res.send({ message: "please provide password" })
        }
        console.log(req.body.password)
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.hash = hash
        console.log(req.body.hash)
        const updatePassword = await UsersModel.update(
            { password: req.body.hash }, { where: { username: req.body.username } })
        console.log(updatePassword, '11111111111111111')
    }


    catch (err) {
        res.status(500).send(err.message);

    }
});




module.exports = router
