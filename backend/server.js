// backend/server.js
require('dotenv').config(); // Isso deve ser a primeira linha

// === 1.IMPORTAÇÕES ===
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const express = require('express');
const cors = require('cors'); // Habilita a comunicação entre domínios
const cookieParser = require('cookie-parser'); // NOVIDADE

const corsOptions = {
  origin: ["http://localhost:5173"], // domínios permitidos
  methods: "GET,POST,PUT,DELETE",
  credentials: true
};

// Importa suas rotas de autenticação e rotas privadas
const authRoutes = require('./src/routes/auth.routes.js');
const privateRoutes = require('./src/routes/private.routes');

// === 2. INICIALIZAÇÃO DO APP ===
const app = express();
const PORT = process.env.PORT || 5000; // Define a porta, com 5000 como fallback

// --- 3. MIDDLEWARES DE SEGURANÇA E BÁSICOS ---
// **Todos os app.use() precisam vir após a declaração de const app = express();**
// Middleware para entender JSON (deve ser um dos primeiros)
app.use(express.json()); // Permite que a API leia JSON
app.use(cookieParser()); // NOVIDADE: Habilita a leitura de req.cookies
app.use(cors(corsOptions));

// 1. Defesa de Cabeçalhos (Helmet)
app.use(helmet()); 

// 2. Limitação de Requisições (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Máximo de 100 requisições por IP
});
app.use(limiter);

// 3. Permissão de Acesso (CORS) - MUITO IMPORTANTE
app.use(cors({
  // Apenas o domínio do nosso frontend é permitido
  origin: "http://localhost:5173",
  credentials: true // 🚨 NOVIDADE: Permite que o frontend envie e receba cookies
}));

// --- 4. CONFIGURAÇÃO DAS ROTAS ---
// Rotas públicas (como login e registro)
app.use('/api/auth', authRoutes); // Qualquer requisição para /api/auth... vai para auth.routes.js

// Rotas protegidas (são as que exigem um token válido)
app.use('/api', privateRoutes); // Direciona as requisições para /api...

// --- 5. INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});