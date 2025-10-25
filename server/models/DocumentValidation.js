const { DataTypes } = require("sequelize");
const sequelize = require('../database/db');
const Expense = require("./Expenses"); // modelo Expenses já existente

const DocumentValidation = sequelize.define(
  "DocumentValidation",
  {
    validation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // garante validação única por despesa
      references: {
        model: Expense,
        key: "expense_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    document_type: {
      type: DataTypes.STRING(10),
      allowNull: false, // 'CPF' ou 'CNPJ'
    },
    document_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    validation_status: {
      type: DataTypes.STRING(20),
      allowNull: false, // 'Pending', 'Validated', 'Invalid'
    },
    validation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Document_Validation",
    timestamps: false,
  }
);

// Associação com Expenses
DocumentValidation.belongsTo(Expense, {
  foreignKey: "expense_id",
  as: "expense",
});

module.exports = DocumentValidation;
