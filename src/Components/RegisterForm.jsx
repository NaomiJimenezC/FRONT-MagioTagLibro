import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate(); // Para redirigir a la página de usuario
  const { login } = useAuth(); // Actualizar el contexto de autenticación

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
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
    birthDate: Yup.date()
      .max(new Date(), "La fecha de nacimiento no puede ser en el futuro")
      .required("La fecha de nacimiento es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      setSubmitting(false);

      if (response.ok) {
        // Registro exitoso
        login(); // Actualizar el contexto a "logueado"
        navigate("/user"); // Redirigir a la página de usuario
      } else {
        const error = await response.json();
        alert(error.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      setSubmitting(false);
      alert("Error al conectar con el servidor.");
    }
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
              <div>
                <label htmlFor="birthDate">Fecha de nacimiento</label>
                <Field
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  aria-required="true"
                />
                <ErrorMessage name="birthDate" component="p" />
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
