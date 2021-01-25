const jwt = require('jsonwebtoken')
const UsersAccessToken = require('../models/access_token');
const Secret_Token = process.env.SECRET_TOKEN
module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decoded = jwt.verify(token, Secret_Token)
        const user = await UsersAccessToken.findOne({ where: { access_token: token } })
        console.log(user)
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(e.message)
    }
}
//"user_id": decoded.id,
//where: { access_token: token }