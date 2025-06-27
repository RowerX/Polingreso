require('dotenv').config();
const mysql = require('mysql2/promise');

const db = {
  connect: async () => {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
  },
  disconnect: async (conn) => {
    if (conn) await conn.end();
  },
};

module.exports = db;
