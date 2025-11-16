const mysql = require('mysql2/promise'); // Importa o driver

const pool = mysql.createPool({
    host: 'localhost',
    user: '', // Usuário criado durante a instalação (ex: 'joaozinho')
    password: '', // Senha do usuário
    database: 'biblioteca', // Nome do banco de dados criado
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;