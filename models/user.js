const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const User = sequelize.define("users", {
    firstname: {
        type: Sequelize.STRING(20),
        allowNull: false

    },
    lastname: {
        type: Sequelize.STRING(20),
        allowNull: false

    },
    email: {
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
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
//         firstname,
//         lastname,
//         email,
//         username,
//         password,

//     });
// });

module.exports = User