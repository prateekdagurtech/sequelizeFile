const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const UsersModel = require('../models/user');
const Address = sequelize.define("address", {
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: UsersModel,
            key: 'id'
        }
    },
    address: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    city: {
        type: Sequelize.STRING(20)
    },
    state: {
        type: Sequelize.STRING(20)
    },
    pin_code: {
        type: Sequelize.INTEGER(20)
    },
    phone_no: {
        type: Sequelize.INTEGER(20)
    },
})

Address.sync().then(function () {
    return ''
});

module.exports = Address
