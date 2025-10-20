// apis/claveUnica.js
//Documentación: https://www.claveunica.gob.cl/integracion/



import express from "express";
import {
  obtenerTokenClaveUnica,
  obtenerUsuarioClaveUnica,
} from "../apis/reales/claveUnica.js";

const router = express.Router();

// 🔐 Datos de configuración
const CLIENT_ID = process.env.CLAVEUNICA_CLIENT_ID;
const REDIRECT_URI = process.env.CLAVEUNICA_REDIRECT_URI;

/**
 * 1️ RUTA: Redirige al login de Clave Única
 * El usuario es enviado al portal oficial de autenticación.
 */
router.get("/login", (req, res) => {
  const url = `https://accounts.claveunica.gob.cl/openid/authorize?client_id=${CLIENT_ID}&response_type=code&scope=openid run name&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

/**
 * 2️ RUTA: Recibe el "code" de Clave Única, solicita el token y obtiene los datos del usuario.
 */
router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const tokenData = await obtenerTokenClaveUnica(code);
    const userData = await obtenerUsuarioClaveUnica(tokenData.access_token);

    console.log("✅ Usuario autenticado:", userData);
    res.json({ exito: true, usuario: userData });
  } catch (error) {
    console.error("❌ Error en autenticación:", error.message);
    res.status(500).json({ exito: false, mensaje: "Error en autenticación" });
  }
});

export default router;
