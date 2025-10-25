const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require("./Users");
const IncomeTaxCategory = require("./IncomeTax_Categories");

const Expense = sequelize.define(
  "Expense",
  {
    expense_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    income_tax_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: IncomeTaxCategory,
        key: "income_tax_category_id",
      },
    },
    expense_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    validated_for_tax: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    invoice_file_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Expenses",
    timestamps: false,
  }
);

module.exports = Expense;
