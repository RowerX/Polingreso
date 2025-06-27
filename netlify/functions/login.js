const db = require('./db');

exports.handler = async (event) => {
  try {
    console.log("🟡 login.js - evento recibido:", event.body);

    const { nombre, correo } = JSON.parse(event.body);
    console.log("🟢 Datos recibidos:", nombre, correo);

    const connection = await db.connect();
    console.log("✅ Conexión a base de datos establecida");

    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE nombre = ? AND correo = ?',
      [nombre.trim(), correo.trim().toLowerCase()]
    );
    console.log("🔍 Resultados:", rows);

    await db.disconnect(connection);
    console.log("🔒 Conexión cerrada");

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
    console.error("❌ ERROR en login.js:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: err.message }),
    };
  }
};
