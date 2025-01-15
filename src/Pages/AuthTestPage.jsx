import React from "react";
import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/AuthContext";  // Asegúrate de que este es tu contexto de autenticación

const AuthTestPage = () => {
  const { isLoggedIn, login, logout } = useAuth();  // Usamos el contexto de autenticación

  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout();  // Si está logueado, hace logout
    } else {
      login();  // Si no está logueado, hace login
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Prueba de Autenticación</h1>
      <p>{isLoggedIn ? "Estás autenticado." : "No estás autenticado."}</p>

      <button onClick={handleLoginClick}>
        {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </div>
  );
};

export default AuthTestPage;
