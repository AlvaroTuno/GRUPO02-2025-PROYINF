
//FaceIO se ejecuta en el frontend (React), pero este backend guarda o valida los resultados.


import express from "express";

const router = express.Router();

/**
 * Guardar resultado de reconocimiento facial
 */
router.post("/verificar", async (req, res) => {
  try {
    const { email, confianza } = req.body;

    if (confianza >= 0.9) {
      console.log(`✅ Usuario ${email} verificado con confianza ${confianza}`);
      return res.json({ exito: true, mensaje: "Verificación facial exitosa" });
    } else {
      return res.status(400).json({ exito: false, mensaje: "Confianza insuficiente" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al procesar verificación facial" });
  }
});

export default router;
