const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  try {
    const { nombre, correo } = JSON.parse(event.body);

    if (!nombre || !correo) {
      return {
        statusCode: 400,
        body: 'Faltan datos',
      };
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE nombre = ? AND correo = ?',
      [nombre.trim(), correo.trim().toLowerCase()]
    );

    await connection.end();

    if (rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success' }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'fail' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error en base de datos: ' + err.message,
    };
  }
};
