import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const LoginForm = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityCodeSent, setSecurityCodeSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.identifier,
          password: values.password,
        }),
      });

      setSubmitting(false);

      if (response.ok) {
        login(); // Actualizar el contexto de autenticación
        navigate("/user"); // Redirigir a la página de usuario
      } else {
        const error = await response.json();
        alert(error.message || "Error al iniciar sesión. Verifique sus credenciales.");
      }
    } catch (error) {
      setSubmitting(false);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleForgotPassword = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: values.identifier }),
      });

      setSubmitting(false);

      if (response.ok) {
        setSecurityCodeSent(true);
        alert("Código de seguridad enviado al email.");
      } else {
        const error = await response.json();
        alert(error.message || "Error al enviar el código. Verifique el usuario o correo.");
      }
    } catch (error) {
      setSubmitting(false);
      alert("Error al conectar con el servidor.");
    }
  };

  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      setSubmitting(false);

      if (response.ok) {
        alert("Contraseña restablecida exitosamente.");
        setShowForgotPassword(false);
        setSecurityCodeSent(false);
      } else {
        const error = await response.json();
        alert(error.message || "Error al restablecer la contraseña. Verifique el código.");
      }
    } catch (error) {
      setSubmitting(false);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <main>
      <section aria-labelledby="login-form-title">
        <h1 id="login-form-title">Inicio de Sesión</h1>
        {!showForgotPassword ? (
          <Formik
            initialValues={{ identifier: "", password: "" }}
            validationSchema={Yup.object({
              identifier: Yup.string().required("Usuario o correo es obligatorio"),
              password: Yup.string().required("La contraseña es obligatoria"),
            })}
            onSubmit={handleSubmitLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <fieldset>
                  <legend>Ingrese sus credenciales</legend>
                  <p>
                    <label htmlFor="identifier">Usuario o Correo</label>
                    <Field id="identifier" name="identifier" type="text" aria-required="true" />
                    <ErrorMessage name="identifier" component="span" />
                  </p>
                  <p>
                    <label htmlFor="password">Contraseña</label>
                    <Field id="password" name="password" type="password" aria-required="true" />
                    <ErrorMessage name="password" component="span" />
                  </p>
                </fieldset>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
                <button type="button" onClick={() => setShowForgotPassword(true)}>
                  He olvidado mi contraseña
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={
              securityCodeSent
                ? { identifier: "", securityCode: "", newPassword: "" }
                : { identifier: "" }
            }
            validationSchema={
              securityCodeSent
                ? Yup.object({
                    identifier: Yup.string().required("Usuario o correo es obligatorio"),
                    securityCode: Yup.string().required("El código de seguridad es obligatorio"),
                    newPassword: Yup.string()
                      .min(6, "La contraseña debe tener al menos 6 caracteres")
                      .required("La nueva contraseña es obligatoria"),
                  })
                : Yup.object({
                    identifier: Yup.string().required("Usuario o correo es obligatorio"),
                  })
            }
            onSubmit={securityCodeSent ? handleResetPassword : handleForgotPassword}
          >
            {({ isSubmitting }) => (
              <Form>
                <fieldset>
                  <legend>
                    {securityCodeSent ? "Restablecer contraseña" : "Recuperar contraseña"}
                  </legend>
                  <p>
                    <label htmlFor="identifier">Usuario o Correo</label>
                    <Field id="identifier" name="identifier" type="text" aria-required="true" />
                    <ErrorMessage name="identifier" component="span" />
                  </p>
                  {securityCodeSent && (
                    <>
                      <p>
                        <label htmlFor="securityCode">Código de Seguridad</label>
                        <Field
                          id="securityCode"
                          name="securityCode"
                          type="text"
                          aria-required="true"
                        />
                        <ErrorMessage name="securityCode" component="span" />
                      </p>
                      <p>
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          aria-required="true"
                        />
                        <ErrorMessage name="newPassword" component="span" />
                      </p>
                    </>
                  )}
                </fieldset>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting
                    ? "Procesando..."
                    : securityCodeSent
                    ? "Restablecer Contraseña"
                    : "Enviar Código"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setSecurityCodeSent(false);
                  }}
                >
                  Volver al inicio de sesión
                </button>
              </Form>
            )}
          </Formik>
        )}
      </section>
    </main>
  );
};

export default LoginForm;
