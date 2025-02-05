import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import * as PropTypes from "prop-types";
import FaSun from "../Assets/Sun.svg";
import '../Sass/components/_Navbar.scss';
import '../Sass/core/_Variables.scss'

function FontAwesomeIcon(props) {
  return null;
}

FontAwesomeIcon.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.shape({ color: PropTypes.string }),
};

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('Light');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const themes = ['Light', 'Dark'];

  const handleThemeChange = () => {
    const newTheme = currentTheme === 'Light' ? 'Dark' : 'Light';
    setCurrentTheme(newTheme);
    document.body.classList.remove(...themes);
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'Light';
    setCurrentTheme(storedTheme);
    document.body.classList.add(storedTheme);
  }, []);

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
      <h3>
        <Link className="navbar-logo" to="/" aria-label="Ir a la página principal">
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

        <button className="theme-button" onClick={handleThemeChange}>
          {currentTheme}
          <img src={FaSun} alt="Icono del sol" className="sun-icon" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
