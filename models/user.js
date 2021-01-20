const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const User = sequelize.define("users", {
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    //     email: {
    //         type: Sequelize.STRING,
    //         unique: true,
    //         require: true
    //     },
    //     username: {
    //         type: Sequelize.STRING,
    //         required: true,
    //         unique: true,
    //     },
    //     hash: {
    //         type: Sequelize.STRING,
    //         required: true,
    //         bcrypt: true,
    //     },
    //     salt: {
    //         type: Sequelize.STRING,
    //         required: true,
    //         bcrypt: true,
    //     },

},
    {
        freezeTableName: true // Model tableName will be the same as the model name
    })
User.sync({ force: true }).then(function () {
    return User.create({
        firstname: 'John',
        lastname: 'Hancock'
    });
});

User.findOne().then(function (user) {
    console.log(user.get('firstName'));
});

module.exports = User