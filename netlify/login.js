const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  try {
    const { nombre, correo } = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE nombre = ? AND correo = ?', [nombre, correo]);

    if (rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success', usuario: rows[0] })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'fail' })
      };
    }
  } catch (err) {
    console.error('Error en login.js:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
