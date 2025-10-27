const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const FiscalRulesLimit = require("./FiscalRules");

const IncomeTaxCategory = sequelize.define(
  "IncomeTaxCategory",
  {
    income_tax_category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    deductible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "IncomeTax_Categories",
    timestamps: false,
  }
);

module.exports = IncomeTaxCategory;
