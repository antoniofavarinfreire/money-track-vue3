const IncomeTaxCategory = require("./IncomeTax_Categories");
const FiscalRulesLimit = require("./FiscalRules");
const FiscalRule = require("./FiscalRules");

// Todas as associações ficam aqui, após os models já terem sido importados

// IncomeTaxCategory -> FiscalRulesLimit
IncomeTaxCategory.hasMany(FiscalRulesLimit, {
  foreignKey: "income_tax_category_id",
  as: "fiscal_limits",
});

// FiscalRule -> IncomeTaxCategory
FiscalRule.belongsTo(IncomeTaxCategory, {
  foreignKey: "income_tax_category_id",
  as: "category",
});

module.exports = {
  IncomeTaxCategory,
  FiscalRulesLimit,
  FiscalRule,
};
