import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Asegúrate de que el contexto de autenticación está funcionando

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useAuth(); // Verificamos si el usuario está autenticado

  if (!isLoggedIn) {
    // Si no está logueado, redirige al login
    return <Navigate to="/auth-test" />;
  }

  return element; // Si está logueado, renderiza la ruta
};

export default ProtectedRoute;
