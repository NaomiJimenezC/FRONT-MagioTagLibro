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

  const themeIcons = {
    Light: Sun,
    Dark: HalfMoon,
    DarkDark: Moon,
  };

  const logInIcons = {
    Light: LogInLight,
    Dark: LogInDark,
    DarkDark: LogInDarkDark,
  };

  const userIcons = {
    Light: UserLight,
    Dark: UserDark,
    DarkDark: UserDarkDark,
  };

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
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsDropdownOpen(false);
  };

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
      <nav className="navbar" aria-label={"Menú de navegación"}>
        <h3>
          <Link className="navbar-logo" to="/" aria-label="Ir a la página principal">
            <img src={Logo} alt="Logotipo de MagioTaglibro" className="logo" />
          </Link>
        </h3>
        <div className="navbar-buttons">
          {isLoggedIn && (
              <Link to="/diaries" className="navbar-link">
                <button className="navbar-button">Mis diarios</button>
              </Link>
          )}
          <button
              onClick={handleAuthClick}
              className="navbar-button"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label={isLoggedIn ? "Abrir menú de usuario" : "Iniciar sesión"}
          >
            <img src={isLoggedIn ? userIcons[currentTheme] : logInIcons[currentTheme]} alt="Icono de usuario" className="usuario-icon" />
          </button>
          {isLoggedIn && isDropdownOpen && (
              <ul className="navbar-dropdown" ref={dropdownRef} role="menu">
                <li role="menuitem">
                  <Link to="/user" className="navbar-dropdown-link">
                    <button className="navbar-dropdown-button">Ir al perfil</button>
                  </Link>
                </li>
                <li role="menuitem">
                  <button onClick={handleLogout} className="navbar-dropdown-button">Cerrar sesión</button>
                </li>
              </ul>
          )}
          <button className="theme-button" onClick={handleThemeChange} aria-label="Cambiar tema">
            <img src={themeIcons[currentTheme]} alt="Icono de cambio de tema" className="theme-icon" />
          </button>
        </div>
      </nav>
  );
};

export default Navbar;