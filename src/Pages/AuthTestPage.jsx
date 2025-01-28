import React from "react";
import Layout from "../Layout/MainLayout"; 
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
    <Layout>
      <article aria-labelledby="auth-test-title">
        <h1 id="auth-test-title">Prueba de Autenticación</h1>
        <p aria-live="polite">
          {isLoggedIn ? "Estás autenticado." : "No estás autenticado."}
        </p>
        <button onClick={handleLoginClick}>
          {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
        </button>
      </article>
    </Layout>
  );
};

export default AuthTestPage;
