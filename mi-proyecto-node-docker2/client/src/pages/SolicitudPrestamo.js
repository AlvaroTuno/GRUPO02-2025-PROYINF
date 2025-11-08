import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 👈 importar

export default function SolicitudPrestamo() {
  const { user } = useAuth(); // 👈 obtener usuario logueado
  const [monto, setMonto] = useState(0);
  const [cuotas, setCuotas] = useState(2);
  const [loading, setLoading] = useState(false);

  const interesFijo = 0.0095; // 0.95% mensual fijo

  const interesTotal = monto * interesFijo;
  const cuotaMensual = cuotas > 0 ? (monto + interesTotal) / cuotas : 0;

  const handleSolicitud = async () => {
    if (monto <= 0 || cuotas <= 0) {
      alert("Por favor ingresa un monto y número de cuotas válidos.");
      return;
    }

    if (!user?.rut) {
      alert("Debes iniciar sesión para solicitar un préstamo.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        rut_cliente: user.rut, // 👈 enviamos rut del usuario logueado
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al registrar el préstamo");
      }

      const { prestamo, cuotas: cuotasGeneradas } = result.data || {};

      alert(
        `✅ Préstamo registrado correctamente.\n\n` +
          `RUT cliente: ${prestamo?.rut_cliente}\n` +
          `Monto: $${Math.round(prestamo?.monto || monto).toLocaleString("es-CL")}\n` +
          `Cuotas generadas: ${cuotasGeneradas?.length || cuotas}\n` +
          `Primera vence: ${cuotasGeneradas?.[0]?.fecha_vencimiento || "—"}`
      );

      console.log("📦 Resultado completo:", result);
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      alert("Ocurrió un error al registrar el préstamo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Solicitud de Préstamo</h1>
      <p>Completa los datos para generar tu solicitud y ver el plan de pagos.</p>

      {/* Monto */}
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

      {/* Cuotas */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Número de cuotas:
        </label>
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
        <p>Interés a pagar: ${Math.round(interesTotal).toLocaleString("es-CL")}</p>
        <p>Cuota mensual: ${Math.round(cuotaMensual).toLocaleString("es-CL")}</p>
      </div>

      {/* Botón */}
      <button
        onClick={handleSolicitud}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Solicitar"}
      </button>
    </div>
  );
}
