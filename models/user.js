const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const User = sequelize.define("users", {
    firstname: {
        type: Sequelize.STRING(20),
        required: true
    },
    lastname: {
        type: Sequelize.STRING(20),
        required: true
    },
    email: {
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    salt: {
        type: Sequelize.STRING(200),
    },

});




// User.sync({ force: true }).then(function () {
//     return User.create({
//         firstname: 'John',
//         lastname: 'Hancock',
//         email: 'prateek@gmail.com',
//         username: 'prateekdagur',
//         password: 'dagur'

//     });
// });

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
module.exports = User