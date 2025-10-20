// apis/floid.js
//Documentación: https://docs.floid.app/ 

// /apis/mock/faceioMock.js
import express from "express";

const router = express.Router();

// Simula verificación facial
router.post("/verificar", (req, res) => {
  res.json({
    exito: true,
    usuario: "mock@faceio.net",
    confianza: 0.95,
    mensaje: "Autenticación facial simulada (modo test)",
  });
});

export default router;


