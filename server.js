const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// CONEXIÓN A POSTGRESQL
// ===============================
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "smartstock",
    password: "caramelo22",
    port: 5432,
});

// 🔎 Probar conexión a la base de datos
pool.connect()
    .then(() => console.log("✅ Conectado a PostgreSQL"))
    .catch(err => console.error("❌ Error conexión DB:", err));


// ===============================
// CREAR USUARIO (ENCRIPTADO)
// ===============================
app.post("/api/crear", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                error: "Campos vacíos"
            });
        }

        // 🔐 Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO usuarios (usuario, password) VALUES ($1, $2)",
            [usuario, hashedPassword]
        );

        res.json({ success: true });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({
            success: false,
            error: "Error al crear usuario"
        });
    }
});


// ===============================
// LOGIN
// ===============================
app.post("/api/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = $1",
            [usuario]
        );

        if (result.rows.length === 0) {
            return res.json({ success: false });
        }

        const user = result.rows[0];

        // 🔓 Comparar contraseña
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({
            success: false,
            error: "Error en login"
        });
    }
});


// ===============================
// SERVIDOR
// ===============================
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});