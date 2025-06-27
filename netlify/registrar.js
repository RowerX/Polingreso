const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  const { nombre, correo } = JSON.parse(event.body);

  if (!nombre || !correo) {
    return {
      statusCode: 400,
      body: 'Faltan datos',
    };
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    await connection.execute(
      'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
      [nombre, correo]
    );

    await connection.end();

    return {
      statusCode: 200,
      body: 'Registro exitoso',
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error en base de datos: ' + err.message,
    };
  }
};
