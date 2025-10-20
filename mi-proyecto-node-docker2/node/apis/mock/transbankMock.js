//instalar esto en la terminal: 
//npm install transbank-sdk

//Documentacion: https://www.transbankdevelopers.cl/


// /apis/mock/transbankMock.js
import express from "express";

const router = express.Router();

// Simula la creación de una transacción
router.post("/pago", (req, res) => {
  const { buyOrder, sessionId, amount } = req.body;
  res.json({
    token: "MOCK-TOKEN-123",
    url: "https://webpay3g.transbank.cl/simulation",
    buyOrder,
    sessionId,
    amount,
    estado: "CREADA",
  });
});

// Simula confirmación de pago
router.post("/confirmacion", (req, res) => {
  res.json({
    token: "MOCK-TOKEN-123",
    autorizacion: "APROBADA",
    estado: "OK",
    detalle: {
      monto: 12000,
      codigo_autorizacion: "A12345",
      fecha: new Date().toISOString(),
    },
  });
});

export default router;

