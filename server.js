const express = require('express');
const cors = require('cors');
const connection = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/registrar', (req, res) => {
    const { nombre, correo } = req.body;
    if (!nombre || !correo) return res.status(400).send('Faltan datos');

    const sql = 'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)';
    connection.query(sql, [nombre, correo], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en base de datos');
        }
        res.send('Registro exitoso');
    });
});
app.post('/login', (req, res) => {
    let { nombre, correo } = req.body;
    nombre = nombre.trim();
    correo = correo.trim().toLowerCase();

    const sql = 'SELECT * FROM usuarios WHERE nombre = ? AND correo = ?';
    connection.query(sql, [nombre, correo], (err, results) => {
        if (err) {
            console.error('Error en consulta:', err);
            return res.status(500).send('Error en base de datos');
        }

        console.log('Resultado de búsqueda:', results);

        if (results.length > 0) {
            res.send('success');
        } else {
            res.send('fail');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor Node escuchando en http://localhost:3000');
});
