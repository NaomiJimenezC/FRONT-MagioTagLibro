import React, { useState } from "react";
import Layout from "../Layout/MainLayout";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";
import "../Sass/pages/_LoginRegister.scss";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Layout>
      <section className="auth-container">
        <header className="auth-header">
          <h1 className="auth-title">
            {isLogin
              ? "¡Inicia sesión y sigue guardando el registro de tu propia aventura mágica!"
              : "¡Empieza a escribir sobre tu aventura mágica desde hoy!"}
          </h1>
          <p className="auth-toggle-text">
            {isLogin ? (
              <>
                O empieza a hacerlo {" "}
                <a 
                  onClick={handleToggleForm}
                  aria-label="Ir a la página de registro"
                  className="auth-toggle-link"
                >
                  <strong>aquí</strong>
                </a>{" "}
                creándote una cuenta
              </>
            ) : (
              <>
                ¿Ya tienes cuenta? Inicia sesión {" "}
                <a
                  onClick={handleToggleForm}
                  aria-label="Ir a la página de inicio de sesión"
                  className="auth-toggle-link"
                >
                  <strong>aquí</strong>
                </a>
              </>
            )}
          </p>
        </header>
      </section>
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </Layout>
  );
};

export default AuthPage;