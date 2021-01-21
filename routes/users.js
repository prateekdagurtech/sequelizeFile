const express = require('express')
const UsersModel = require('../models/user')
const bcrypt = require('bcrypt');
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
        console.log(UsersModel, '44444444')
        let createUser = await UsersModel.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.hash,
            salt: req.body.salt
        });
        res.send(createUser)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})
// let data = await user.save();
// res.send(data)
//}


// router.put('/delete', async (req, res) => {
//     try {
//         const user_id = req.user.user_id
//         const deleteUser = await UsersModel.findOneAndRemove({ "_id": user_id })
//         res.json({ message: 'user deleted' })
//     } catch (e) {
//         res.status(401).send(e.message)
//     }
// });
// router.get('/get', async function (req, res) {
//     const per_page = parseInt(req.query.per_page) || 3
//     const page_no = parseInt(req.query.page_no) || 1
//     const pagination = {
//         limit: per_page,
//         skip: per_page * (page_no - 1)
//     }
//     users = await UsersModel.find().limit(pagination.limit).skip(pagination.skip)
//     res.send(users)
// });

module.exports = router
