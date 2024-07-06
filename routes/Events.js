const express = require("express");
const router = express.Router();
const db = require("../db"); // Asegúrate de que la ruta sea correcta
const app = express();
const moment = require("moment-timezone");
app.use(express.json());
require('dotenv').config();
// Leer las claves API desde el archivo .env y convertirlas en un array
const API_KEYS = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

// Middleware para verificar la API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header("api-key");
  if (API_KEYS.includes(apiKey)) {
    next(); // La API key es correcta, sigue con la solicitud
  } else {
    res.status(403).json({ error: "Acceso denegado: API key inválida."}); // La API key es incorrecta
  }
};

// Usa el middleware en las rutas que necesiten autenticación
router.use(authenticateApiKey);

router.get("/", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM eventos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos de eventos" });
  }
});

// Nueva ruta para insertar un evento
router.post("/", async (req, res) => {
  const { id, title, fechainicio, fechafin, description, email, phone, timezone } = req.body;

  // Ajustar la fecha y hora a la zona horaria del cliente
  const fechainicioClient = moment.tz(fechainicio, timezone).format();
  const fechafinClient = moment.tz(fechafin, timezone).format();

  try {
    const result = await db.pool.query(
      "INSERT INTO eventos (id, title, fechainicio, fechafin, description, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id, title, fechainicioClient, fechafinClient, description, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al insertar evento" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.pool.query(
      "DELETE FROM eventos WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "eventos no encontrado" });
    }
    res.json({
      message: "eventos eliminado correctamente",
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el eventos" });
  }
});
module.exports = router;
