import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔸 Cuentas placeholder
  const cuentas = [
    { rut: "11111111-1", clave: "1234", nombre: "Usuario de Prueba" },
  ];

  // ✅ Restaurar sesión si existe
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

const login = async (rut, clave) => {
  try {
    const res = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, clave }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

    const loggedUser = { rut: data.user.rut, nombre: data.user.nombre || "Usuario" };
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    navigate("/", { replace: true });
  } catch (error) {
    alert(error.message);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
