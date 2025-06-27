const db = require('./db');

exports.handler = async (event) => {
  try {
    const { nombre, correo } = JSON.parse(event.body);

    if (!nombre || !correo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'error', message: 'Faltan datos' }),
      };
    }

    const connection = await db.connect();

    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE nombre = ? AND correo = ?',
      [nombre.trim(), correo.trim().toLowerCase()]
    );

    await db.disconnect(connection);

    if (rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'success', message: 'Login correcto' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ status: 'error', message: 'Credenciales incorrectas' }),
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Error: ' + err.message }),
    };
  }
};
