import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterForm = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .required("El nombre de usuario es obligatorio"),
    email: Yup.string()
      .email("Formato de correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("La confirmación de la contraseña es obligatoria"),
  });

  const handleSubmit = (values) => {
    // Simulación de envío al servidor
    fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          alert("¡Usuario registrado con éxito!");
        } else {
          alert("Error al registrar el usuario. Inténtalo nuevamente.");
        }
      })
      .catch(() => alert("Error al conectar con el servidor."));
  };

  return (
    <section aria-labelledby="register-form-title">
      <h1 id="register-form-title">Registro</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <fieldset>
              <legend>Complete los campos para registrarse</legend>
              <div>
                <label htmlFor="username">Nombre de usuario</label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  aria-required="true"
                />
                <ErrorMessage name="username" component="p" />
              </div>
              <div>
                <label htmlFor="email">Correo electrónico</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  aria-required="true"
                />
                <ErrorMessage name="email" component="p" />
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  aria-required="true"
                />
                <ErrorMessage name="password" component="p" />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  aria-required="true"
                />
                <ErrorMessage name="confirmPassword" component="p" />
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default RegisterForm;