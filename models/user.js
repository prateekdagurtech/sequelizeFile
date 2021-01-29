const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const UsersAddress = require('../models/address');

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

User.sync().then(function () {
    return ''
});
User.hasMany(UsersAddress, {
    foreignKey: 'userId',
    as: 'addresses'
});
UsersAddress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users'
});

module.exports = User