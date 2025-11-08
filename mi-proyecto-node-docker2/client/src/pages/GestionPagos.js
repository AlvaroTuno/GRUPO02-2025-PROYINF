import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // 👈 importar el contexto

export default function Pagos() {
  const { user } = useAuth(); // 👈 obtener el usuario logueado
  const [deudas, setDeudas] = useState([]);
  const [metodo, setMetodo] = useState("transbank");
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar lista de deudas del RUT logueado
  useEffect(() => {
    if (!user?.rut) return; // 👈 si no hay usuario logueado, no hace nada

    fetch(`http://localhost:3000/api/pagos/deudas?rut=${user.rut}`)
      .then((res) => res.json())
      .then((data) => setDeudas(data))
      .catch(() => alert("❌ Error al cargar la lista de deudas"));
  }, [user]); // 👈 se ejecuta cada vez que cambia el usuario

  const handlePago = async (cuota) => {
    setCargando(true);

    try {
      const response = await fetch("http://localhost:3000/api/pagos/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_prestamo: cuota.id_prestamo,
          id_cuota: cuota.id_cuota,
          monto: cuota.monto_cuota,
          metodo_pago: metodo,
        }),
      });

      const data = await response.json();

      if (data.url_transbank) {
        // 🔹 Redirigir al flujo real de Transbank
        window.location.href = data.url_transbank;
      } else {
        alert("✅ Pago registrado localmente (modo demo)");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error al procesar el pago");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>💰 Gestión de Pagos</h1>
      <p>Selecciona el método de pago y paga tus cuotas pendientes.</p>

      {/* Selector de método de pago */}
      <div style={{ marginTop: "20px" }}>
        <label>Método de pago:</label>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          <option value="transbank">Transbank (Webpay)</option>
          <option value="transferencia">Transferencia Bancaria</option>
        </select>
      </div>

      {/* Tabla de deudas pendientes */}
      <div style={{ marginTop: "40px" }}>
        {!user?.rut ? (
          <p>🔒 Debes iniciar sesión para ver tus deudas.</p>
        ) : deudas.length === 0 ? (
          <p>🎉 ¡No tienes deudas pendientes!</p>
        ) : (
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              width: "85%",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                <th style={{ padding: "10px" }}># Préstamo</th>
                <th style={{ padding: "10px" }}># Cuota</th>
                <th style={{ padding: "10px" }}>Monto</th>
                <th style={{ padding: "10px" }}>Vencimiento</th>
                <th style={{ padding: "10px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {deudas.map((cuota) => (
                <tr key={cuota.id_cuota}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {cuota.id_prestamo}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {cuota.numero_cuota}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    ${cuota.monto_cuota.toLocaleString("es-CL")}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {new Date(cuota.fecha_vencimiento).toLocaleDateString("es-CL")}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <button
                      onClick={() => handlePago(cuota)}
                      disabled={cargando}
                      style={{
                        padding: "6px 12px",
                        fontSize: "14px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {cargando ? "Procesando..." : "💳 Pagar ahora"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
