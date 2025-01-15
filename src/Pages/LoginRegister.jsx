import React, { useState } from "react";
import Navbar from "../Components/Navbar";  // Asegúrate de importar la Navbar
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <main>
      <Navbar /> {/* Aquí se agrega la Navbar */}
      <section aria-labelledby="auth-page-title">
        <h1 id="auth-page-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>

        {isLogin ? (
          <>
            <LoginForm />
            <p>
              ¿No tienes cuenta?{" "}
              <button onClick={handleToggleForm} aria-label="Ir a la página de registro">
                Regístrate aquí
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />
            <p>
              ¿Ya tienes cuenta?{" "}
              <button onClick={handleToggleForm} aria-label="Ir a la página de inicio de sesión">
                Inicia sesión aquí
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default AuthPage;
