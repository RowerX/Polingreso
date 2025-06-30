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

    const [existente] = await connection.execute(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo.trim().toLowerCase()]
    );

    if (existente.length > 0) {
      await db.disconnect(connection);
      return {
        statusCode: 409,
        body: JSON.stringify({'Correo ya registrado' }),
      };
    }

    await connection.execute(
      'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
      [nombre.trim(), correo.trim().toLowerCase()]
    );

    await db.disconnect(connection);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success', message: 'Registro exitoso' }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: 'Error: ' + err.message }),
    };
  }
};
