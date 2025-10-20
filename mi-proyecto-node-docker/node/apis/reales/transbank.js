//instalar esto en la terminal: 
//npm install transbank-sdk

//Documentacion: https://www.transbankdevelopers.cl/


import axios from "axios";

const BASE_URL = process.env.TBK_API_URL;
const COMMERCE_CODE = process.env.TBK_COMMERCE_CODE;
const API_KEY = process.env.TBK_API_KEY;

/**
 * 1️ Crear transacción (inicio de pago)
 */
export const crearTransaccion = async (buyOrder, sessionId, amount, returnUrl) => {
  const headers = {
    "Tbk-Api-Key-Id": COMMERCE_CODE,
    "Tbk-Api-Key-Secret": API_KEY,
    "Content-Type": "application/json",
  };

  const body = {
    buy_order: buyOrder,
    session_id: sessionId,
    amount: amount,
    return_url: returnUrl,
  };

  const { data } = await axios.post(`${BASE_URL}/transactions`, body, { headers });
  return data;
};

/**
 * 2️ Confirmar transacción (una vez pagada)
 */
export const confirmarTransaccion = async (token) => {
  const headers = {
    "Tbk-Api-Key-Id": COMMERCE_CODE,
    "Tbk-Api-Key-Secret": API_KEY,
    "Content-Type": "application/json",
  };

  const { data } = await axios.put(`${BASE_URL}/transactions/${token}`, {}, { headers });
  return data;
};

