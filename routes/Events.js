const express = require("express");
const router = express.Router();
const db = require("../db");
const app = express();
app.use(express.json());
router.get("/", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM eventos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos de clientes" });
  }
});

module.exports = router;