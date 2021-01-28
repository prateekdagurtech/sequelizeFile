const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')

const forgotTokens = sequelize.define("forgotTokens", {

    username: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    resetPasswordToken: {
        type: Sequelize.STRING(200),
        expire: '600s',
        default: Date.now()
    },

})

forgotTokens.sync().then(function () {
    return ''
});

module.exports = forgotTokens