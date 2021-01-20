const express = require('express')
const UsersModel = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.hash, salt);
        req.body.hash = hash
        req.body.salt = salt
        const user = new UsersModel(req.body);
        let data = await user.save();
        res.send(data)
    }
    catch (err) {
        res.status(500).send(err);

    }
})
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
