const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const forgotTokens = sequelize.define("forgotTokens", {
    email: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    resetPasswordToken: {
        type: Sequelize.STRING(200),
        expire: '6s',
        default: Date.now()
    }
})
forgotTokens.sync().then(function () {
    return ''
});

module.exports = forgotTokens