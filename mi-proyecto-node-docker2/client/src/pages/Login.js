import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Llamar a tu backend
      const res = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut, clave: password }),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      // Autenticación exitosa → guarda usuario en contexto
      login(rut, password);
      navigate("/"); // Redirigir al Home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-5 border-0" style={{ width: "22rem" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Inicio de Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">RUT</label>
            <input
              type="text"
              className="form-control"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="11111111-1"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Clave</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>

        {/* 🔹 Nuevo: enlace hacia registro */}
        <button
          className="btn btn-link mt-3 text-secondary"
          onClick={() => navigate("/register")}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
}
