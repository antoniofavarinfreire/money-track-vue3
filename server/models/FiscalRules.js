const { DataTypes } = require("sequelize");
const sequelize = require('../database/db');
const IncomeTaxCategory = require("./IncomeTax_Categories");

const FiscalRule = sequelize.define(
  "FiscalRule",
  {
    rule_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fiscal_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    income_tax_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: IncomeTaxCategory,
        key: "income_tax_category_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    annual_limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monthly_limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "FiscalRules_Limits",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["fiscal_year", "income_tax_category_id"],
      },
    ],
  }
);

module.exports = FiscalRule;
