const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FiscalRule = require("../../models/FiscalRules"); // Modelo Sequelize
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

// Middleware de verificação do token
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

// ✅ Criar regra fiscal
router.post("/", limiter, verifyToken, async (req, res) => {
  try {
    const { fiscal_year, income_tax_category_id, annual_limit, monthly_limit } =
      req.body;

    const existingRule = await FiscalRule.findOne({
      where: { fiscal_year, income_tax_category_id },
    });
    if (existingRule)
      return res.status(400).json({
        error: "Já existe uma regra para essa categoria nesse ano fiscal.",
      });

    const newRule = await FiscalRule.create({
      fiscal_year,
      income_tax_category_id,
      annual_limit,
      monthly_limit,
      last_updated: new Date(),
    });

    res.status(201).json({ message: "Regra fiscal criada", rule: newRule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ✅ Atualizar regra fiscal específica
router.put("/:id", limiter, verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { annual_limit, monthly_limit } = req.body;

    const rule = await FiscalRule.findByPk(id);
    if (!rule) return res.status(404).json({ error: "Regra não encontrada" });

    rule.annual_limit = annual_limit !== undefined ? annual_limit : rule.annual_limit;
    rule.monthly_limit = monthly_limit !== undefined ? monthly_limit : rule.monthly_limit;
    rule.last_updated = new Date();

    await rule.save();
    res.json({ message: "Regra atualizada", rule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ✅ Visualizar todas as regras fiscais
router.get("/", limiter, verifyToken, async (req, res) => {
  try {
    const rules = await FiscalRule.findAll();
    res.json(rules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ✅ Visualizar regra fiscal específica
router.get("/:id", limiter, verifyToken, async (req, res) => {
  try {
    const rule = await FiscalRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: "Regra não encontrada" });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ✅ Deletar regra fiscal específica
router.delete("/:id", limiter, verifyToken, async (req, res) => {
  try {
    const rule = await FiscalRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: "Regra não encontrada" });

    await rule.destroy();
    res.json({ message: "Regra fiscal deletada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
