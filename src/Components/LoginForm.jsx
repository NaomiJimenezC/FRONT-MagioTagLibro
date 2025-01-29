import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const apiRequest = async (url, method, body, onSuccess, onError) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (response.ok) {
      onSuccess(data);
    } else {
      onError(data.message || "Error en la solicitud.");
    }
  } catch {
    onError("Error al conectar con el servidor.");
  }
};

const LoginForm = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityCodeSent, setSecurityCodeSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (values, { setSubmitting }) => {
    apiRequest(
      "https://backend-magiotaglibro.onrender.com/api/users/login",
      "POST",
      { username: values.identifier, password: values.password },
      (data) => {
        // Desestructurar datos de login recibidos
        const { message, token, user } = data;

        // Mostrar mensaje de éxito
        console.log("Datos de login recibidos:", data);
        alert(message); // Mostrar el mensaje de éxito

        // Guardar el token y el usuario en localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user)); // Guardar el usuario completo en localStorage
        console.log("Token guardado en localStorage:", token);

        // Llamar la función login
        login(user); // Función para manejar el login

        // Redirigir a la página de usuario
        navigate("/user");
      },
      (message) => alert(message) // Si ocurre un error, mostrarlo
    ).finally(() => setSubmitting(false));
  };

  const handleForgotPassword = (values, { setSubmitting }) =>
    apiRequest(
      "https://backend-magiotaglibro.onrender.com/api/users/forgot-password",
      "POST",
      { identifier: values.identifier },
      () => {
        setSecurityCodeSent(true);
        alert("Código de seguridad enviado al email.");
      },
      (message) => alert(message)
    ).finally(() => setSubmitting(false));

  const handleResetPassword = (values, { setSubmitting }) =>
    apiRequest(
      "https://backend-magiotaglibro.onrender.com/api/users/reset-password",
      "POST",
      values,
      () => {
        alert("Contraseña restablecida exitosamente.");
        setShowForgotPassword(false);
        setSecurityCodeSent(false);
      },
      (message) => alert(message)
    ).finally(() => setSubmitting(false));

  const renderForm = (isReset) => (
    <Formik
      initialValues={
        isReset
          ? { identifier: "", securityCode: "", newPassword: "" }
          : { identifier: "", password: "" }
      }
      validationSchema={Yup.object(
        isReset
          ? {
              identifier: Yup.string().required("Usuario o correo es obligatorio"),
              securityCode: Yup.string().required("El código de seguridad es obligatorio"),
              newPassword: Yup.string()
                .min(6, "La contraseña debe tener al menos 6 caracteres")
                .required("La nueva contraseña es obligatoria"),
            }
          : {
              identifier: Yup.string().required("Usuario o correo es obligatorio"),
              password: Yup.string().required("La contraseña es obligatoria"),
            }
      )}
      onSubmit={isReset ? handleResetPassword : showForgotPassword ? handleForgotPassword : handleLogin}
    >
      {({ isSubmitting }) => (
        <Form>
          <fieldset>
            <legend>{isReset ? "Restablecer contraseña" : "Ingrese sus credenciales"}</legend>
            <p>
              <label htmlFor="identifier">Usuario o Correo</label>
              <Field id="identifier" name="identifier" type="text" aria-required="true" />
              <ErrorMessage name="identifier" component="span" />
            </p>
            {isReset && (
              <>
                <p>
                  <label htmlFor="securityCode">Código de Seguridad</label>
                  <Field id="securityCode" name="securityCode" type="text" aria-required="true" />
                  <ErrorMessage name="securityCode" component="span" />
                </p>
                <p>
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <Field id="newPassword" name="newPassword" type="password" aria-required="true" />
                  <ErrorMessage name="newPassword" component="span" />
                </p>
              </>
            )}
            {!isReset && !showForgotPassword && (
              <p>
                <label htmlFor="password">Contraseña</label>
                <Field id="password" name="password" type="password" aria-required="true" />
                <ErrorMessage name="password" component="span" />
              </p>
            )}
          </fieldset>
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting
              ? "Procesando..."
              : isReset
              ? "Restablecer Contraseña"
              : showForgotPassword
              ? "Enviar Código"
              : "Iniciar Sesión"}
          </button>
          <button
            type="button"
            onClick={() =>
              isReset
                ? setSecurityCodeSent(false)
                : setShowForgotPassword(!showForgotPassword)
            }
          >
            {isReset || showForgotPassword ? "Volver al inicio de sesión" : "He olvidado mi contraseña"}
          </button>
        </Form>
      )}
    </Formik>
  );

  return (
    <main>
      <section aria-labelledby="login-form-title">
        {renderForm(securityCodeSent)}
      </section>
    </main>
  );
};

export default LoginForm;
