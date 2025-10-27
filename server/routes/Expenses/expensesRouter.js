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
router.post("/create-id-expense", limiter, verifyToken, async (req, res) => {
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
router.get("/view-id-all-expense", limiter, verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar expenses" });
  }
});

// ✅ Visualizar Expense específico
router.post("/view-id-expense", limiter, verifyToken, async (req, res) => {
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
router.put("/update-id-expense", limiter, verifyToken, async (req, res) => {
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
router.delete("/delete-id-expense", limiter, verifyToken, async (req, res) => {
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

// ✅ Criar Expense (sempre vinculado ao usuário logado)
router.post("/create-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { income_tax_category_id, expense_date, amount, description, validated_for_tax, invoice_file_path } = req.body;

    const newExpense = await Expense.create({
      user_id: req.userId,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar despesa" });
  }
});

// ✅ Visualizar todas as despesas do usuário logado
router.get("/view-user-all-expenses", limiter, verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { user_id: req.userId },
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar despesas" });
  }
});

// ✅ Visualizar uma despesa específica (apenas se for do usuário logado)
router.post("/view-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const expense = await Expense.findOne({
      where: { expense_id: id, user_id: req.userId },
    });
    if (!expense) return res.status(404).json({ error: "Despesa não encontrada" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar despesa" });
  }
});

// ✅ Atualizar despesa do usuário logado
router.put("/update-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id, income_tax_category_id, expense_date, amount, description, validated_for_tax, invoice_file_path } = req.body;

    const expense = await Expense.findOne({
      where: { expense_id, user_id: req.userId },
    });
    if (!expense) return res.status(404).json({ error: "Despesa não encontrada" });

    await expense.update({
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
    });

    res.json({ message: "Despesa atualizada com sucesso", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar despesa" });
  }
});

// ✅ Deletar despesa do usuário logado
router.delete("/delete-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id } = req.body;

    const expense = await Expense.findOne({
      where: { expense_id, user_id: req.userId },
    });
    if (!expense) return res.status(404).json({ error: "Despesa não encontrada" });

    await expense.destroy();
    res.json({ message: "Despesa deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar despesa" });
  }
});

// ✅ Retornar despesas com flag de dedutibilidade
router.get("/with-deductible-flag", limiter, verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: IncomeTaxCategory,
          as: "category",
          attributes: ["name", "deductible"],
        },
      ],
    });

    // adiciona a flag dedutível no retorno
    const formatted = expenses.map((e) => ({
      expense_id: e.expense_id,
      expense_date: e.expense_date,
      amount: e.amount,
      description: e.description,
      validated_for_tax: e.validated_for_tax,
      invoice_file_path: e.invoice_file_path,
      income_tax_category_id: e.income_tax_category_id,
      is_deductible: e.category?.deductible === 1,
      category_name: e.category?.name || null,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar despesas com flag dedutível:", error);
    res.status(500).json({ error: "Erro ao buscar despesas com flag dedutível." });
  }
});

module.exports = router;
