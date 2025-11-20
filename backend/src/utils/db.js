const mysql = require('mysql2/promise'); // Importa o driver

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Usuário criado durante a instalação (ex: 'root')
    password: 'MySql', // Senha do usuário
    database: 'biblioteca', // Nome do banco de dados criado
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;