// apis/claveUnica.js
//Documentación: https://www.claveunica.gob.cl/integracion/

// /apis/mock/claveUnicaMock.js
import express from "express";

const router = express.Router();

// Simula login directo sin Clave Única real
router.get("/login", (req, res) => {
  res.send("🔐 Clave Única simulada: login exitoso (modo test)");
});

// Simula callback con usuario genérico
router.get("/callback", (req, res) => {
  res.json({
    exito: true,
    usuario: {
      run: "12345678-9",
      name: "Usuario de Prueba",
      email: "prueba@claveunica.cl",
    },
  });
});

export default router;
