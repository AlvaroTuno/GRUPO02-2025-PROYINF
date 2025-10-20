// Importar dependencias y componentes principales
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas base
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Messages from "./pages/Messages";

// Módulos del sistema de préstamos
import SolicitudPrestamo from "./pages/SolicitudPrestamo";
import GestionPagos from "./pages/GestionPagos";
import EvaluacionRiesgo from "./pages/EvaluacionRiesgo";
import PrestamoPreAprobado from "./pages/PrestamoPreAprobado";

// Integraciones con APIs externas
import ClaveUnicaPage from "./pages/ClaveUnicaPage";
import TransbankPage from "./pages/TransbankPage";
import FloidPage from "./pages/FloidPage";
import FaceIOPage from "./pages/FaceIOPage";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container my-4">
        <Routes>
          {/* Secciones principales */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<Messages />} />

          {/* Sistema de préstamos */}
          <Route path="/solicitud-prestamo" element={<SolicitudPrestamo />} />
          <Route path="/gestion-pagos" element={<GestionPagos />} />
          <Route path="/evaluacion-riesgo" element={<EvaluacionRiesgo />} />
          <Route path="/prestamo-preaprobado" element={<PrestamoPreAprobado />} />

          {/* Pruebas de integraciones (mock / real) */}
          <Route path="/claveunica" element={<ClaveUnicaPage />} />
          <Route path="/transbank" element={<TransbankPage />} />
          <Route path="/floid" element={<FloidPage />} />
          <Route path="/faceio" element={<FaceIOPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
