const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const Address = sequelize.define("address", {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
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

module.exports = Address