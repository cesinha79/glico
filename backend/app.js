import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './database/db.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "fallback_super_secreto";

// ======================================================
// MIDDLEWARE: Verificação de JWT
// ======================================================
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// ======================================================
// POST /api/auth/register — Cadastro de usuário
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres" });
  }

  try {
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    res.status(201).json({ mensagem: "Conta criada com sucesso" });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

// ======================================================
// POST /api/auth/login — Login e geração de token
// ======================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, nome: usuario.nome });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

// ======================================================
// GET /api/auth/me — Dados do usuário logado
// ======================================================
app.get('/api/auth/me', auth, (req, res) => {
  res.json({ usuario: req.usuario });
});

export default app;