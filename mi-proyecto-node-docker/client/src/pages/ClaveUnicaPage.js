// /client/src/pages/ClaveUnicaPage.js
import React from "react";
import api from "../services/apiClient";

const ClaveUnicaPage = () => {
  const handleLogin = async () => {
    const res = await api.get("/claveunica/login");
    alert("Redirigiendo a Clave Única (modo mock): " + res.data);
  };

  return (
    <div className="container text-center mt-5">
      <h2>Prueba Clave Única</h2>
      <button onClick={handleLogin} className="btn btn-primary mt-3">
        Iniciar sesión con Clave Única
      </button>
    </div>
  );
};

export default ClaveUnicaPage;
