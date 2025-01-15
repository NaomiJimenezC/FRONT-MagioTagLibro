import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isLoggedIn, logout, user } = useAuth(); // Usamos el contexto de autenticación para obtener el estado y el nombre de usuario
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen); // Alterna el desplegable
    } else {
      navigate("/auth-test"); // Si no está logueado, redirige al login
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Cierra el desplegable después de cerrar sesión
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
        <Link to="/" aria-label="Ir a la página principal" style={{ color: "#fff", textDecoration: "none" }}>
          🏠 Magio Taglibro
        </Link>
      </h1>

      <div>
        {isLoggedIn && (
          <Link to="/diaries" style={{ color: "#fff", marginRight: "1rem" }}>
            <button>Mis diarios</button>
          </Link>
        )}

        <button onClick={handleAuthClick}>
          {isLoggedIn ? user?.username || "Usuario X" : "Iniciar sesión"}
        </button>

        {isLoggedIn && isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px", // Ajusta la posición si es necesario
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
              <button style={{
                marginTop: "10px",
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}>


              Ir al perfil
                </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                marginTop: "10px",
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
