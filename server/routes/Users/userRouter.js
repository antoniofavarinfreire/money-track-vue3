const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users"); // modelo Sequelize

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

// 🧩 Middleware de verificação do token JWT
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

// ✅ LOGIN (não requer token)
router.post("/login", limiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "E-mail ou senha inválidos." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "E-mail ou senha inválidos." });

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// ✅ CRIAR USUÁRIO (público - registro)
router.post("/create-user", limiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      registration_date: new Date(),
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        registration_date: newUser.registration_date,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ✅ PROTEGER todas as rotas abaixo
router.use(verifyToken);

// ✅ VISUALIZAR TODOS OS USUÁRIOS
router.get("/view-all-users", limiter, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "registration_date"],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// ✅ VISUALIZAR USUÁRIO ESPECÍFICO
router.post("/view-id-user", limiter, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório." });
    }

    const user = await User.findByPk(id, {
      attributes: ["user_id", "name", "email", "registration_date"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário no banco de dados." });
  }
});

// ✅ ATUALIZAR USUÁRIO ESPECÍFICO
router.put("/update-id-user/:id", limiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password)
      updatedData.password_hash = await bcrypt.hash(password, 10);

    await user.update(updatedData);

    res.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// ✅ DELETAR USUÁRIO ESPECÍFICO
router.delete("/delete-id-user/:id", limiter, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    await user.destroy();
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// ✅ VISUALIZAR O USUÁRIO LOGADO
router.get("/view-user", limiter, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["user_id", "name", "email", "registration_date"],
    });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuário logado" });
  }
});

// ✅ ATUALIZAR O USUÁRIO LOGADO
router.put("/update-user", limiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password)
      updatedData.password_hash = await bcrypt.hash(password, 10);

    await user.update(updatedData);

    res.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// ✅ DELETAR O USUÁRIO LOGADO
router.delete("/delete-user", limiter, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    await user.destroy();
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

module.exports = router;
