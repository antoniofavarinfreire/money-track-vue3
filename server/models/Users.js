const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('User', {
   
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
   
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
   
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
   
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
   
    registration_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Users', // Nome da tabela no banco de dados
    timestamps: false   // Desativa createdAt e updatedAt automáticos
});

module.exports = User;
