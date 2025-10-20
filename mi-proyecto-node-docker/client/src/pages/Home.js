import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const opciones = [
    { label: "Solicitud de Préstamo", route: "/solicitud-prestamo", icon: "bi bi-cash-stack" },
    { label: "Gestión de Pagos", route: "/gestion-pagos", icon: "bi bi-credit-card" },
    { label: "Evaluación de Riesgo", route: "/evaluacion-riesgo", icon: "bi bi-shield-check" },
    { label: "Préstamo Pre-Aprobado", route: "/prestamo-preaprobado", icon: "bi bi-hand-thumbs-up" },
  ];

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1 className="mb-5 text-center fw-bold text-primary">Menú Principal</h1>
      <div className="row g-4 w-100 justify-content-center">
        {opciones.map((op, i) => (
          <div key={i} className="col-10 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
            <div
              className="card shadow-lg text-center p-4 border-0"
              style={{ cursor: "pointer", width: "15rem" }}
              onClick={() => navigate(op.route)}
            >
              <i className={`${op.icon} fs-1 text-primary mb-3`}></i>
              <h5 className="fw-bold">{op.label}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
