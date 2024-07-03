const express = require("express");
const { Pool } = require("pg");
const db = require("./db");
const clientesRouter = require("./routes/Events");
const cors = require("cors"); // Requiere el paquete cors

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// Configuración de la conexión a la base de datos
const pool = db.pool;
// Rutas
app.use("/events", clientesRouter);

// Inicia el servidor
app.listen(port, () => {
  console.log("Servidor escuchando en http://localhost:${port}");
});
