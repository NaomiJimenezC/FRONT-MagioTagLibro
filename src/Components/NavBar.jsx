import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext"; // Ajusta la ruta si es necesario

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
        setUser(null); // Si el JSON es inválido, seteamos `user` como null
      }
    } else {
      setUser(null); // Si no existe el usuario o es "undefined", lo dejamos como null
    }
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null); // Limpiar el usuario del estado
    navigate("/"); // Redirige a la página principal
    setIsDropdownOpen(false);
  };

  // Solo mostrar el nombre de usuario cuando se haya cargado correctamente el estado `user`
  const getUsername = () => {
    if (isLoggedIn && user) {
      return user.username || "Usuario no encontrado";
    }
    return isLoggedIn ? "Cargando..." : "Iniciar sesión";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
        borderBottom: "2px solid",
        borderColor: isDarkMode ? "#555" : "#ddd",
      }}
    >
      <h1 className="navbar-logo">
        <Link
          to="/"
          aria-label="Ir a la página principal"
          style={{ color: isDarkMode ? "#fff" : "#333", textDecoration: "none" }}
        >
          🏠 Magio Taglibro
        </Link>
      </h1>

      <div>
        {isLoggedIn && (
          <Link to="/diaries" style={{ marginRight: "1rem", textDecoration: "none" }}>
            <button style={{ backgroundColor: "transparent", color: isDarkMode ? "#fff" : "#333" }}>
              Mis diarios
            </button>
          </Link>
        )}

        <button onClick={handleAuthClick}>
          {getUsername()}
        </button>

        {isLoggedIn && isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "20px",
              backgroundColor: isDarkMode ? "#444" : "#fff",
              color: isDarkMode ? "#fff" : "#333",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 10,
            }}
          >
            <Link to="/user">
              <button
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "10px",
                  backgroundColor: "blue",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Ir al perfil
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}

        <button onClick={toggleTheme}>
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
