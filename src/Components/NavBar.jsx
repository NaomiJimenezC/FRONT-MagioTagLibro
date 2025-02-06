import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import * as PropTypes from "prop-types";
import Moon from "../Assets/Theme/Moon.svg";
import HalfMoon from "../Assets/Theme/HalfMoon.svg";
import Sun from "../Assets/Theme/Sun.svg";
import LogInLight from "../Assets/LogIn/Light.svg";
import LogInDark from "../Assets/LogIn/Dark.svg";
import LogInDarkDark from "../Assets/LogIn/DarkDark.svg";
import UserLight from "../Assets/User/Light.svg";
import UserDark from "../Assets/User/Dark.svg";
import UserDarkDark from "../Assets/User/DarkDark.svg";
import Logo from "../Assets/MagioTaglibro.png";
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

  function themeIcon() {
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
  function logInIcon() {
    if (currentTheme === "Light") {
      return (<img src={LogInLight} alt="Log In" className="login-icon"/>)
    }
    if (currentTheme === "Dark") {
      return (<img src={LogInDark} alt="Log In" className="login-icon"/>)
    }
    if (currentTheme === "DarkDark") {
      return (<img src={LogInDarkDark} alt="Log In" className="login-icon"/>)
    }
  }
  function userIcon() {
    if (currentTheme === "Light") {
      return (<img src={UserLight} alt="Usuario" className="usuario-icon"/>)
    }
    if (currentTheme === "Dark") {
      return (<img src={UserDark} alt="Usuario" className="usuario-icon"/>)
    }
    if (currentTheme === "DarkDark") {
      return (<img src={UserDarkDark} alt="Usuario" className="usuario-icon"/>)
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
          <img src={Logo} alt="Bienvenido a MagioTaglibro" className="logo"></img>
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
            {isLoggedIn ? (
                userIcon()
            ) : (
                logInIcon()
            )}
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
          {themeIcon()}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
