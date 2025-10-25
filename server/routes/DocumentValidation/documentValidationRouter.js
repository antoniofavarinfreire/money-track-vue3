const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const DocumentValidation = require("../../models/DocumentValidation");

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

// ✅ Criar validação
router.post("/", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id, document_type, document_number, validation_status, validation_date } = req.body;

    const newValidation = await DocumentValidation.create({
      expense_id,
      document_type,
      document_number,
      validation_status,
      validation_date,
    });

    res.status(201).json(newValidation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar validação." });
  }
});

// ✅ Atualizar validação
router.put("/", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id, document_type, document_number, validation_status, validation_date } = req.body;

    const validation = await DocumentValidation.findOne({ where: { expense_id } });
    if (!validation) return res.status(404).json({ error: "Validação não encontrada." });

    validation.document_type = document_type;
    validation.document_number = document_number;
    validation.validation_status = validation_status;
    validation.validation_date = validation_date;

    await validation.save();
    res.json(validation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar validação." });
  }
});

// ✅ Visualizar todas as validações
router.get("/", limiter, verifyToken, async (req, res) => {
  try {
    const validations = await DocumentValidation.findAll();
    res.json(validations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar validações." });
  }
});

// ✅ Visualizar validação específica
router.post("/get", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id } = req.body;
    const validation = await DocumentValidation.findOne({ where: { expense_id } });
    if (!validation) return res.status(404).json({ error: "Validação não encontrada." });
    res.json(validation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar validação." });
  }
});

// ✅ Deletar validação
router.delete("/", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id } = req.body;
    const validation = await DocumentValidation.findOne({ where: { expense_id } });
    if (!validation) return res.status(404).json({ error: "Validação não encontrada." });

    await validation.destroy();
    res.json({ message: "Validação deletada com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar validação." });
  }
});

module.exports = router;
