const mysql = require('mysql2/promise'); // Importa o driver

const pool = mysql.createPool({
    host: 'localhost',
    user: 'Guto007', // Usuário criado durante a instalação (ex: 'renato')
    password: 'Msql123!', // Senha do usuário
    database: 'biblioteca', // Nome do banco de dados criado
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;