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
      <section>
          <header>
            <h1 id="auth-page-title">
              {isLogin 
                ? "¡Inicia sesión y sigue guardando el registro de tu propia aventura mágica!" 
                : "¡Empieza a escribir sobre tu aventura mágica desde hoy!"}
            </h1>
            {isLogin ? (
              <p>
                O empieza hacerlo  {" "}
                <a 
                  onClick={handleToggleForm}
                  aria-label="Ir a la página de registro"
                  style={{ cursor: 'pointer' }}
                >
                  <strong>aquí </strong>
                </a>
                creándote una cuenta
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta? Inicia sesión{" "}
                <a
                  onClick={handleToggleForm}
                  aria-label="Ir a la página de inicio de sesión"
                  style={{ cursor: 'pointer' }}
                >
                   <strong>aquí</strong>
                </a>
              </p>
            )}
          </header>
      </section>

      
        {isLogin ? (
          <>
            <LoginForm />
          </>
        ) : (
          <>
            <RegisterForm />
          </>
        )}
    </Layout>
  );
};

export default AuthPage;
