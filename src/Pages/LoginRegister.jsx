import React, { useState } from "react";
import Layout from "../Layout/MainLayout"; 
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Layout>
      <header>
        <h1 id="auth-page-title">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h1>
      </header>
      <main role="main">
        {isLogin ? (
          <>
            <LoginForm />
            <p>
              ¿No tienes cuenta?{" "}
              <button
                onClick={handleToggleForm}
                aria-label="Ir a la página de registro"
              >
                Regístrate aquí
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={handleToggleForm}
                aria-label="Ir a la página de inicio de sesión"
              >
                Inicia sesión aquí
              </button>
            </p>
          </>
        )}
      </main>
    </Layout>
  );
};

export default AuthPage;
