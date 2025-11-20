// backend/src/routes/auth.routes.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator'); //<-- NOVIDADE: Importa o validador

// ----------------------------------------------------------------------
// ROTA DE REGISTRO (POST /register) - INSERINDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post(
    '/register', 
    [
        // NOVIDADE 2: Regras de validação
        body('email').isEmail().withMessage('O e-mail fornecido não é válido.'),
        body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.')
    ],
    async (req, res) => {
        //NOVIDADE 3: Captura erros da validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const { email, password } = req.body;
    
    try {
        // 1. Criptografa a senha antes de salvar (boas práticas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // 2. Executa a query de INSERÇÃO no MySQL
        // O uso de '?' previne ataques de SQL Injection.
        await db.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        console.error(error);
        // Trata o erro de email duplicado (ER_DUP_ENTRY do MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// ----------------------------------------------------------------------
// ROTA DE LOGIN (POST /login) - VALIDANDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Executa a query de SELEÇÃO para buscar o usuário no MySQL
        // O resultado da query vem em um array, a primeira posição ([0]) são as linhas.
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            // Se o MySQL não retornou linhas, o usuário não existe.
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha digitada com o hash do MySQL
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gera o JWT (não muda, pois o login foi validado)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // MUDANÇA CRÍTICA: Armazena o token como um cookie HTTP-Only
        res.cookie('jwt', token, {
            httpOnly: true, // NENHUM JAVASCRIPT pode ler este cookie (Proteção XSS)
            secure: process.env.NODE_ENV === 'production', // Use 'true' em HTTPS
            maxAge: 3600000 // 1 hora
        });

        // Retorna o sucesso. Não precisamos do res.json({ token })
        res.status(200).json({ message: 'Login bem-sucedido. Token enviado via Cookie.' });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;

// ----------------------------------------------------------------------
// ROTA DE BUSCAR LIVRO (GET /livros/:id) - BUSCANDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.get('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT l.titulo, l.conteudo, u.email AS autor_email
             FROM livros l
             LEFT JOIN users u ON l.autor_id = u.id
             WHERE l.id = ?`,
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Livro não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livro.' });
    }
});

// ----------------------------------------------------------------------
// ROTA DE LISTAR TODOS OS LIVROS (GET /livros)
// ----------------------------------------------------------------------
router.get('/livros', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT l.id, l.titulo, u.email AS autor_email
             FROM livros l
             LEFT JOIN users u ON l.autor_id = u.id`
        );
        res.status(200).json(rows);
    } catch (error) {
        console.log('Erro ao buscar livros:', error);
        res.status(500).json({ message: 'Erro ao buscar livros.' });
    }
});

// ----------------------------------------------------------------------
// ROTA DE REGISTRAR LIVRO (POST /texto) - INSERINDO DADOS NO MYSQL
// Protegida por `authMiddleware` e com validação dos campos
// ----------------------------------------------------------------------
router.post(
    '/texto',
    authMiddleware,
    [
        body('titulo').notEmpty().withMessage('O título é obrigatório.'),
        body('conteudo').notEmpty().withMessage('O conteúdo é obrigatório.')
    ],
    async (req, res) => {
        console.log("Iniciando validação de dados do livro.");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { titulo, conteudo } = req.body;
        try {
            console.log("Registrando livro para o autor ID:", req.user.id);
            await db.execute(
                'INSERT INTO livros (titulo, conteudo, autor_id) VALUES (?, ?, ?)',
                [titulo, conteudo, req.user.id]
            );
            console.log("Livro registrado com sucesso.");
            res.status(201).json({ message: 'Livro registrado com sucesso.' });
        } catch (error) {
            console.log("Erro ao registrar livro:", error);
            res.status(500).json({ message: 'Erro no servidor.' });
        }
    }
);