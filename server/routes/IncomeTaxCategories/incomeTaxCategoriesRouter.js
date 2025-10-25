const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const IncomeTaxCategory = require("../../models/IncomeTax_Categories"); // modelo Sequelize

const JWT_SECRET = "chave-super-secreta"; // mesma chave usada no userRouter

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

// 🔐 Middleware de verificação de token JWT
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

// 🔐 Todas as rotas abaixo exigem autenticação
router.use(verifyToken);

// ✅ 1️⃣ Criar categoria de imposto de renda específica
router.post("/", limiter, async (req, res) => {
  try {
    const { name, deductible, description } = req.body;

    if (!name || typeof deductible === "undefined") {
      return res
        .status(400)
        .json({ error: "Os campos 'name' e 'deductible' são obrigatórios." });
    }

    const existing = await IncomeTaxCategory.findOne({ where: { name } });
    if (existing)
      return res.status(400).json({ error: "Categoria já cadastrada." });

    const newCategory = await IncomeTaxCategory.create({
      name,
      deductible,
      description,
    });

    res.status(201).json({
      message: "Categoria criada com sucesso.",
      category: newCategory,
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro ao criar categoria." });
  }
});

// ✅ 2️⃣ Visualizar todas as categorias
router.get("/", limiter, async (req, res) => {
  try {
    const categories = await IncomeTaxCategory.findAll({
      attributes: ["income_tax_category_id", "name", "deductible", "description"],
    });
    res.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

// ✅ 3️⃣ Visualizar categoria específica via JSON
router.post("/getById", limiter, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ error: "ID da categoria é obrigatório." });

    const category = await IncomeTaxCategory.findByPk(id, {
      attributes: ["income_tax_category_id", "name", "deductible", "description"],
    });

    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada." });

    res.json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    res.status(500).json({ error: "Erro ao buscar categoria." });
  }
});

// ✅ 4️⃣ Atualizar categoria específica
router.put("/", limiter, async (req, res) => {
  try {
    const { id, name, deductible, description } = req.body;

    if (!id)
      return res.status(400).json({ error: "ID da categoria é obrigatório." });

    const category = await IncomeTaxCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada." });

    await category.update({
      name: name ?? category.name,
      deductible: typeof deductible !== "undefined" ? deductible : category.deductible,
      description: description ?? category.description,
    });

    res.json({
      message: "Categoria atualizada com sucesso.",
      category,
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ error: "Erro ao atualizar categoria." });
  }
});

// ✅ 5️⃣ Deletar categoria específica
router.delete("/", limiter, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({ error: "ID da categoria é obrigatório." });

    const category = await IncomeTaxCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada." });

    await category.destroy();

    res.json({ message: "Categoria deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ error: "Erro ao deletar categoria." });
  }
});

module.exports = router;
