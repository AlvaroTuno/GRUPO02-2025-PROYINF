import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import scoringRouter from "./routes/scoring.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/scoring", scoringRouter);

// ---------------------------
// 🔹 RUTAS API
// ---------------------------

// Ruta base para probar el servidor
app.get("/", (req, res) => {
  res.send("✅ Servidor backend funcionando correctamente.");
});

// Ruta para insertar una solicitud de préstamo
// Ruta para insertar una solicitud de préstamo + cuotas
app.post("/api/prestamos", async (req, res) => {
  const client = await pool.connect(); // para usar transacción
  try {
    const { rut_cliente, monto, cuotas, interesTotal, cuotaMensual } = req.body;

    if (!rut_cliente || !monto || !cuotas || cuotas <= 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios o cuotas inválidas." });
    }

    const resultPrestamo = await client.query(
      "INSERT INTO prestamos (rut_cliente, monto, cuotas, interes_total, cuota_mensual) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [rut_cliente, monto, cuotas, interesTotal, cuotaMensual]
    );

    const prestamo = resultPrestamo.rows[0];
    const idPrestamo = prestamo.id;

    // 2️⃣ Calcular cuotas (fechas y montos)
    const cuotasArray = [];
    const montoCuota = cuotaMensual || monto / cuotas;

    for (let i = 1; i <= cuotas; i++) {
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      cuotasArray.push({
        id_prestamo: idPrestamo,
        numero_cuota: i,
        monto_cuota: montoCuota,
        fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
        pagada: false,
      });
    }

    // 3️⃣ Insertar cuotas en la base de datos
    for (const c of cuotasArray) {
      await client.query(
        "INSERT INTO cuotas (id_prestamo, numero_cuota, monto_cuota, fecha_vencimiento, pagada) VALUES ($1, $2, $3, $4, $5)",
        [c.id_prestamo, c.numero_cuota, c.monto_cuota, c.fecha_vencimiento, c.pagada]
      );
    }

    // Confirmar transacción
    await client.query("COMMIT");

    res.status(201).json({
      ok: true,
      message: "✅ Préstamo y cuotas generados correctamente.",
      data: { prestamo, cuotas: cuotasArray },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error al guardar préstamo/cuotas:", error);
    res.status(500).json({ ok: false, error: "Error al registrar préstamo y cuotas." });
  } finally {
    client.release();
  }
});

// ---------------------------
// 🔹 OBTENER TODOS LOS PRÉSTAMOS
// ---------------------------
app.get("/api/prestamos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM prestamos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener préstamos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ---------------------------
// 🔹 Login y Registro
// ---------------------------
app.post("/api/usuarios/registro", async (req, res) => {
  try {
    const { rut, clave } = req.body;

    if (!rut || !clave) {
      return res.status(400).json({ ok: false, error: "Faltan campos obligatorios." });
    }

    const existe = await pool.query("SELECT * FROM usuarios WHERE rut = $1", [rut]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ ok: false, error: "El usuario ya existe." });
    }

    const result = await pool.query(
      "INSERT INTO usuarios (rut, clave) VALUES ($1, $2) RETURNING *",
      [rut, clave]
    );

    res.status(201).json({ ok: true, message: "Usuario registrado correctamente", user: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ ok: false, error: "Error interno al registrar usuario." });
  }
});

app.post("/api/usuarios/login", async (req, res) => {
  try {
    const { rut, clave } = req.body;

    if (!rut || !clave) {
      return res.status(400).json({ ok: false, error: "Faltan credenciales." });
    }

    const result = await pool.query("SELECT * FROM usuarios WHERE rut = $1 AND clave = $2", [rut, clave]);

    if (result.rows.length === 0) {
      return res.status(401).json({ ok: false, error: "RUT o clave incorrectos." });
    }

    res.json({ ok: true, user: result.rows[0] });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ ok: false, error: "Error interno al iniciar sesión." });
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

// ======================================================
// 🧮 RUTA: Guardar evaluación de riesgo (Scoring)
// ======================================================
app.post("/api/scoring", async (req, res) => {
  try {
    const data = req.body;

    const campos = [
      "rut",
      "nombre",
      "apellido_paterno",
      "apellido_materno",
      "edad",
      "sistema_salud",
      "tipo_vivienda",
      "ingreso_mensual",
      "deuda_mensual",
      "condicion_laboral",
      "antiguedad_meses",
      "integrantes_hogar",
      "nivel_educacional",
      "mora_mas_larga_24m",
      "pagos_puntuales_12m",
      "creditos_cerrados_sin_mora",
      "consultas_credito_recientes",
      "antiguedad_crediticia_anios",
      "uso_tarjeta_pct",
      "tipo_pago_tarjeta",
      "kyc_verificado",
      "debe_pension_alimenticia",
      "puntaje",
      "nivel",
      "motivo",
      "fecha"
    ];

    const valores = campos.map((c) => data[c] ?? null);

    // Insertar la evaluación
    const result = await pool.query(
      `
      INSERT INTO scoring_evaluaciones (
        rut, nombre, apellido_paterno, apellido_materno,
        edad, sistema_salud, tipo_vivienda,
        ingreso_mensual, deuda_mensual, condicion_laboral,
        antiguedad_meses, integrantes_hogar, nivel_educacional,
        mora_mas_larga_24m, pagos_puntuales_12m, creditos_cerrados_sin_mora,
        consultas_credito_recientes, antiguedad_crediticia_anios,
        uso_tarjeta_pct, tipo_pago_tarjeta,
        kyc_verificado, debe_pension_alimenticia,
        puntaje, nivel, motivo, fecha
      )
      VALUES (${campos.map((_, i) => `$${i + 1}`).join(", ")})
      RETURNING *;
      `,
      valores
    );

    res.status(201).json({
      ok: true,
      message: "✅ Evaluación de riesgo registrada correctamente.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al guardar la evaluación:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno al guardar la evaluación.",
      error: error.message,
    });
  }
});

// ======================================================
// 📊 RUTA: Listar todas las evaluaciones guardadas
// ======================================================
app.get("/api/scoring", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM scoring_evaluaciones ORDER BY id DESC");
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("❌ Error al obtener evaluaciones:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener las evaluaciones.",
      error: error.message,
    });
  }
});



// Crear usuario placeholder si no existe
(async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios WHERE rut = '12345678-9'");
    if (res.rows.length === 0) {
      await pool.query("INSERT INTO usuarios (rut, clave) VALUES ('12345678-9', '1234')");
      console.log("👤 Usuario de prueba creado: RUT 12345678-9 / CLAVE 1234");
    }
  } catch (err) {
    console.error("Error al crear usuario de prueba:", err);
  }
})();
// ---------------------------
// 🔹 INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
