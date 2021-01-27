const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const AccessToken = sequelize.define("accessToken", {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    access_token: {
        type: Sequelize.STRING,
        allowNull: false
    },
})
AccessToken.sync().then(function () {
    return ''
});

module.exports = AccessToken