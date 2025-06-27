const mysql = require('mysql2/promise');
const url = require('url');

const connectionString = process.env.DATABASE_URL || '';

const params = url.parse(connectionString);
const [user, password] = params.auth ? params.auth.split(':') : [null, null];
const host = params.hostname;
const port = params.port;
const database = params.pathname ? params.pathname.replace('/', '') : null;

const db = {
  connect: async () => {
    if (!host || !user || !password || !database) {
      throw new Error('No se pudo parsear la cadena de conexión');
    }
    return await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
  },
  disconnect: async (conn) => {
    if (conn) await conn.end();
  },
};

module.exports = db;

