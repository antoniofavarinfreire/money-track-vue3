const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Expense = require("../../models/Expenses");
const JWT_SECRET = "chave-super-secreta";

const rateLimit = require("express-rate-limit");
// limiter de taxa: máximo de 100 solicitações por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 500, // máximo de 500 solicitações por IP
  standardHeaders: true, // informa os headers RateLimit
  legacyHeaders: false, // desativa os headers X-RateLimit
});

// Aplicar limiter de taxa a todas as rotas neste roteador
router.use(limiter);

// Middleware JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

// ✅ Criar Expense
router.post("/", verifyToken, async (req, res) => {
  try {
    const { user_id, income_tax_category_id, expense_date, amount, description, validated_for_tax, invoice_file_path } = req.body;
    const newExpense = await Expense.create({
      user_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path
    });
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar expense" });
  }
});

// ✅ Visualizar todos Expenses
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar expenses" });
  }
});

// ✅ Visualizar Expense específico
router.post("/getById", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ error: "Expense não encontrado" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar expense" });
  }
});

// ✅ Atualizar Expense específico
router.put("/", verifyToken, async (req, res) => {
  try {
    const { expense_id, user_id, income_tax_category_id, expense_date, amount, description, validated_for_tax, invoice_file_path } = req.body;
    const expense = await Expense.findByPk(expense_id);
    if (!expense) return res.status(404).json({ error: "Expense não encontrado" });

    await expense.update({ user_id, income_tax_category_id, expense_date, amount, description, validated_for_tax, invoice_file_path });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar expense" });
  }
});

// ✅ Deletar Expense específico
router.delete("/", verifyToken, async (req, res) => {
  try {
    const { expense_id } = req.body;
    const expense = await Expense.findByPk(expense_id);
    if (!expense) return res.status(404).json({ error: "Expense não encontrado" });

    await expense.destroy();
    res.json({ message: "Expense deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar expense" });
  }
});

module.exports = router;
