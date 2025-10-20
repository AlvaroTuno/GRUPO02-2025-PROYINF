import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
// 🔹 RUTAS API
// ---------------------------

// Ruta base para probar el servidor
app.get("/", (req, res) => {
  res.send("✅ Servidor backend funcionando correctamente.");
});

// Ruta para insertar una solicitud de préstamo
app.post("/api/prestamos", async (req, res) => {
  try {
    const { monto, cuotas, interesTotal, cuotaMensual } = req.body;

    // Validación básica
    if (!monto || !cuotas) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // Insertar datos en la base
    const result = await pool.query(
      "INSERT INTO prestamos (monto, cuotas, interes_total, cuota_mensual) VALUES ($1, $2, $3, $4) RETURNING *",
      [monto, cuotas, interesTotal, cuotaMensual]
    );

    res.status(201).json({
      message: "✅ Solicitud registrada correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al guardar el préstamo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para listar solicitudes de préstamo
app.get("/api/prestamos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM prestamos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener préstamos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// 🔹 Obtener lista de deudas pendientes
app.get("/api/pagos/deudas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id AS id_cuota,
        p.id AS id_prestamo,
        c.numero_cuota,
        c.monto_cuota,
        c.fecha_vencimiento,
        c.pagada
      FROM cuotas c
      INNER JOIN prestamos p ON c.id_prestamo = p.id
      WHERE c.pagada = FALSE
      ORDER BY c.fecha_vencimiento ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener deudas:", error);
    res.status(500).json({ error: "Error al obtener las deudas pendientes" });
  }
});




// Simula inicio de pago
app.post("/api/pagos/iniciar", (req, res) => {
  const { metodo_pago, monto } = req.body;

  if (metodo_pago === "transbank") {
    // 🔹 Aquí irá la integración real con la API de Transbank
    return res.json({
      url_transbank: "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
    });
  }

  // Modo local: simula pago exitoso
  res.json({ message: "Pago registrado localmente" });
});


// ---------------------------
// 🔹 INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
