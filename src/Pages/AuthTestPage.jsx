import React from "react";
import Navbar from "../Components/NavBar";
import { useAuth } from "../Context/AuthContext";  
const AuthTestPage = () => {
  const { isLoggedIn, login, logout } = useAuth();  

  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout(); 
    } else {
      login();  
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
