const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const User = sequelize.define("users", {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    access_token: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = User