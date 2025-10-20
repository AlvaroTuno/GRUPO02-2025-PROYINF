import { pool } from "./db.js";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Conectado correctamente:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Error al conectar:", error);
  } finally {
    pool.end();
  }
}

testConnection();
