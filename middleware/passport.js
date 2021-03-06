const jwt = require('jsonwebtoken')
const passport = require('passport')
const UsersAccessToken = require('../models/access_token')
const UsersModel = require('../models/user')
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const Secret_Token = process.env.SECRET_TOKEN

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    UsersModel.findById(id, function (err, user) {
        cb(err, user);
    });
});
passport.use(new Strategy(
    async function (username, password, done) {
        let user = await findByCredentials(username, password)
        const payload = {
            user_id: user.id
        };
        const token = jwt.sign(payload, Secret_Token, {
            expiresIn: 86400
        });
        const token_detail = ({
            success: true,
            message: 'Login Successfully done..... Enjoy your token!',
            access_token: token

        });
        console.log(token_detail.access_token)
        const data = await UsersAccessToken.create({
            user_id: payload.user_id,
            access_token: token_detail.access_token
        })
        return done(null, user)
    }))

findByCredentials = async (username, password) => {
    try {
        const user = await UsersModel.findOne({ where: { "username": username } })
        if (!user) {
            throw new Error("No such username")
        }
        isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error("No any matches of password")
        }
        return user
    } catch (e) {
        res.status(500).send(e.message);

    }
}


module.exports = { passport: passport }