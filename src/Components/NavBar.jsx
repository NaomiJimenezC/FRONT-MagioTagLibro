import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import * as PropTypes from "prop-types";
import Moon from "../Assets/Moon.svg";
import HalfMoon from "../Assets/HalfMoon.svg";
import Sun from "../Assets/Sun.svg";
import "../Sass/components/_Navbar.scss";
import "../Sass/core/_Variables.scss";

function FontAwesomeIcon(props) {
  return null;
}

FontAwesomeIcon.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.shape({ color: PropTypes.string }),
};

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [currentTheme, setCurrentTheme] = useState("Light");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const themes = ["Light", "Dark", "DarkDark"];

  const handleThemeChange = () => {
    const nextThemeIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const newTheme = themes[nextThemeIndex];

    setCurrentTheme(newTheme);
    document.body.classList.remove(...themes);
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  function sunIcon() {
    if (currentTheme === "Light") {
      return (<img src={Sun} alt="Cambiar tema" className="theme-icon-sun"/>)
    }
    if (currentTheme === "Dark") {
      return (<img src={HalfMoon} alt="Cambiar tema" className="theme-icon-half-moon"/>)
    }
    if (currentTheme === "DarkDark") {
      return (<img src={Moon} alt="Cambiar tema" className="theme-icon-moon"/>)
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "Light";
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

  // Cerrar dropdown con ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
      dropdownRef.current?.focus();
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen]);

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
            <button className="navbar-button" tabIndex="0">
              Mis diarios
            </button>
          </Link>
        )}

        <button
          onClick={handleAuthClick}
          className="navbar-button"
          tabIndex="0"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          {getUsername()}
        </button>

        {isLoggedIn && isDropdownOpen && (
          <div
            className="navbar-dropdown"
            ref={dropdownRef}
            tabIndex="0"
            role="menu"
            aria-label="Menú desplegable de usuario"
          >
            <Link to="/user">
              <button className="navbar-dropdown-button" tabIndex="0">
                Ir al perfil
              </button>
            </Link>
            <button onClick={handleLogout} className="navbar-dropdown-button" tabIndex="0">
              Cerrar sesión
            </button>
          </div>
        )}

        <button className="theme-button" onClick={handleThemeChange} tabIndex="0">
          {sunIcon()}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
