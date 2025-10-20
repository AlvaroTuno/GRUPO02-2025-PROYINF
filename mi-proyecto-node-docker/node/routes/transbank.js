//instalar esto en la terminal: 
//npm install transbank-sdk

//Documentacion: https://www.transbankdevelopers.cl/


import express from "express";
import { crearTransaccion, confirmarTransaccion } from "../apis/reales/transbank.js";

const router = express.Router();

/**
 * 1️ Endpoint: iniciar pago
 */
router.post("/pago", async (req, res) => {
  try {
    const { buyOrder, sessionId, amount } = req.body;
    const returnUrl = "http://localhost:3000/api/transbank/confirmacion";
    const data = await crearTransaccion(buyOrder, sessionId, amount, returnUrl);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

/**
 * 2️ Endpoint: confirmar pago (callback)
 */
router.post("/confirmacion", async (req, res) => {
  try {
    const { token_ws } = req.body;
    const data = await confirmarTransaccion(token_ws);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al confirmar transacción" });
  }
});

export default router;

