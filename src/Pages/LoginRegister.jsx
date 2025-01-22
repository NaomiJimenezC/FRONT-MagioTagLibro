import React, { useState } from "react";
import Navbar from "../Components/Navbar.jsx";  
import LoginForm from "../Components/LoginForm.jsx";
import RegisterForm from "../Components/RegisterForm.jsx";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <body>
      <Navbar /> 
      <header>
        <h1 id="auth-page-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
      </header>
      <main>
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
      </main>
    </body>
  );
};

export default AuthPage;
