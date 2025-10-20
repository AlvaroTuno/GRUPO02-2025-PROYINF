// apis/claveUnica.js
//Documentación: https://www.claveunica.gob.cl/integracion/

import axios from "axios";

// 🔗 URL base del sistema OpenID de Clave Única
const AUTH_URL = "https://accounts.claveunica.gob.cl/openid";

// 🔐 Credenciales seguras (extraídas del archivo .env)
const CLIENT_ID = process.env.CLAVEUNICA_CLIENT_ID;
const CLIENT_SECRET = process.env.CLAVEUNICA_CLIENT_SECRET;
const REDIRECT_URI = process.env.CLAVEUNICA_REDIRECT_URI;

/**
 * 1️Función para obtener el token de acceso desde Clave Única.
 * Se usa el "code" entregado en el callback del login.
 */
export const obtenerTokenClaveUnica = async (code) => {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("grant_type", "authorization_code");
  params.append("code", code);

  const { data } = await axios.post(`${AUTH_URL}/token`, params);
  return data; // Contiene access_token, expires_in, etc.
};

/**
 * 2️ Función para obtener la información del usuario autenticado.
 * Usa el access_token obtenido anteriormente.
 */
export const obtenerUsuarioClaveUnica = async (access_token) => {
  const { data } = await axios.get(`${AUTH_URL}/userinfo`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return data; // Contiene rut, nombre, email, etc.
};
