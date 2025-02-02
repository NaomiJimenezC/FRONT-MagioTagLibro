import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import * as PropTypes from "prop-types";
import FaSun from "../Assets/Sun.svg";
import '../Sass/components/_Navbar.scss';

function FontAwesomeIcon(props) {
  return null;
}

FontAwesomeIcon.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.shape({ color: PropTypes.string }),
};

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
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Actualiza la clase en el <html> para cambiar entre modos
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

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
    setUser(null);
    navigate("/");
    setIsDropdownOpen(false);
  };

  const getUsername = () => {
    if (isLoggedIn && user) {
      return user.username || "Usuario no encontrado";
    }
    return isLoggedIn ? "Cargando..." : "Iniciar sesión";
  };

  return (
    <nav className="navbar">
      <h3 className="navbar-logo">
        <Link to="/" aria-label="Ir a la página principal">
          🏠 Magio Taglibro
        </Link>
      </h3>

      <div className="navbar-buttons">
        {isLoggedIn && (
          <Link to="/diaries" style={{ marginRight: "1rem" }}>
            <button className="navbar-button">
              Mis diarios
            </button>
          </Link>
        )}

        <button onClick={handleAuthClick} className="navbar-button">
          {getUsername()}
        </button>

        {isLoggedIn && isDropdownOpen && (
          <div className="navbar-dropdown">
            <Link to="/user">
              <button className="navbar-dropdown-button">Ir al perfil</button>
            </Link>
            <button onClick={handleLogout} className="navbar-dropdown-button">
              Cerrar sesión
            </button>
          </div>
        )}

        <button onClick={toggleTheme} className="navbar-button">
          <img src={FaSun} alt="Icono del sol" className="sun-icon" />
          {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
