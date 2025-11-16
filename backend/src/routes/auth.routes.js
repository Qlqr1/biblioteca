const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db.js');
const authMiddleware = require('../middleware/auth');

// ----------------------------------------------------------------------
// ROTA DE REGISTRO (POST /register) - INSERINDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post('/register', async (req, res) => {
    const { email, nome, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await db.execute(
            'INSERT INTO users (email, nome, password) VALUES (?, ?, ?)',
            [email, nome, hashedPassword]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            // Verifica se o erro foi por email ou nome duplicado
            if (error.message.includes('email')) {
                return res.status(400).json({ message: 'Email já cadastrado.' });
            }
            if (error.message.includes('nome')) {
                return res.status(400).json({ message: 'Nome de usuário já cadastrado.' });
            }
        }
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// ----------------------------------------------------------------------
// ROTA DE LOGIN (POST /login) - VALIDANDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        if (!userName || !password) {
            return res.status(400).json({ message: 'Informe o nome de usuário e a senha.' });
        }
        const [rows] = await db.execute('SELECT * FROM users WHERE nome = ?', [userName]);
        const user = rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, nome: user.nome, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// ----------------------------------------------------------------------
// ROTA DE BUSCAR LIVRO (POST /livros/:id) - BUSCANDO DADOS DADOS NO MYSQL
// ----------------------------------------------------------------------
router.get('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT l.titulo, l.conteudo, u.nome AS autor_nome
             FROM livros l
             JOIN users u ON l.autor_id = u.id
             WHERE l.id = ?`,
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Livro não encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livro.' });
    }
});
// ----------------------------------------------------------------------
// ROTA DE REGISTRAR LIVRO (POST /texto) - INSERINDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post('/texto', authMiddleware, async (req, res) => {
    const { titulo, conteudo } = req.body;
    try {
        await db.execute(
            'INSERT INTO livros (titulo, conteudo, autor_id) VALUES (?, ?, ?)',
            [titulo, conteudo, req.user.id]
        );
        res.status(201).json({ message: 'Livro registrado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;