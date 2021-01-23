const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const AccessToken = sequelize.define("users", {
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    access_token: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = AccessToken