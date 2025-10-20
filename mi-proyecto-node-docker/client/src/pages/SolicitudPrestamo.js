import { useState } from "react";

export default function SolicitudPrestamo() {
  const [monto, setMonto] = useState(0);
  const [cuotas, setCuotas] = useState(2);
  const [loading, setLoading] = useState(false);
  
  // Interés fijo (fácil de reemplazar luego)
  const interesFijo = 0.0095; // 0.95%

  // Calcular interés total a pagar
  const interesTotal = monto * interesFijo;

  // Calcular cuota mensual
  const cuotaMensual = cuotas > 0 ? (monto + interesTotal) / cuotas : 0;

  const handleSolicitud = async () => {
  try {
    const data = {
      monto,
      cuotas,
      interesTotal,
      cuotaMensual,
    };

    const response = await fetch("http://localhost:3000/api/prestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el préstamo");
    }

    const result = await response.json();
    alert(result.message || "✅ Préstamo registrado correctamente");
  } catch (error) {
    console.error("❌ Error en la solicitud:", error);
    alert("Operación Exitosa.");
  }
};



  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Solicitud de Préstamo</h1>
      <p>Aquí podrás completar tu solicitud de préstamo.</p>

      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Monto a solicitar:
        </label>
        <input
          type="number"
          min="0"
          step="1"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          style={{ padding: "8px", width: "200px", fontSize: "16px" }}
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Número de cuotas:
        </label>

        {/* Selector (dropdown) */}
        <select
          value={cuotas}
          onChange={(e) => setCuotas(Number(e.target.value))}
          style={{ padding: "8px", fontSize: "16px", marginBottom: "10px" }}
        >
          {Array.from({ length: 23 }, (_, i) => i + 2).map((n) => (
            <option key={n} value={n}>
              {n} cuotas
            </option>
          ))}
        </select>

        {/* Deslizador */}
        <input
          type="range"
          min="2"
          max="24"
          value={cuotas}
          onChange={(e) => setCuotas(Number(e.target.value))}
          style={{ width: "300px", display: "block", margin: "10px auto" }}
        />
      </div>

      {/* Resumen */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #ccc",
          paddingTop: "20px",
        }}
      >
        <h3>Resumen de la Solicitud</h3>
        <p>Monto solicitado: ${Math.round(monto).toLocaleString("es-CL")}</p>
        <p>N° de cuotas: {cuotas}</p>
        <p>
          Interés a pagar: ${Math.round(interesTotal).toLocaleString("es-CL")}
        </p>
        <p>
          Cuota mensual: ${Math.round(cuotaMensual).toLocaleString("es-CL")}
        </p>
      </div>

      {/* Botón */}
      <button
        onClick={handleSolicitud}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Enviando..." : "Solicitar"}
      </button>
    </div>
  );
}
