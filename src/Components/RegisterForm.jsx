import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .required("Nombre de usuario obligatorio"),
    email: Yup.string()
      .email("Formato de correo inválido")
      .required("Correo obligatorio"),
    password: Yup.string()
      .min(6, "Debe tener al menos 6 caracteres")
      .required("Contraseña obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Confirmación obligatoria"),
    birthDate: Yup.date()
      .max(new Date(), "No puede ser una fecha futura")
      .required("Fecha de nacimiento obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setSubmitting(false);

      const data = await response.json();
      if (response.ok) {
        // Desestructurar los datos de respuesta
        const { message, token, user } = data;

        // Guardar los datos del usuario y el token en localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Llamar la función login para autenticar al usuario
        login(user);

        // Redirigir a la página de usuario
        navigate("/user");
      } else {
        alert(data.message || "Error en el registro.");
      }
    } catch {
      setSubmitting(false);
      alert("Error al conectar con el servidor.");
    }
  };

  const renderField = (label, name, type = "text") => (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} type={type} aria-required="true" />
      <ErrorMessage name={name} component="p" />
    </div>
  );

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
              <legend>Complete los campos</legend>
              {renderField("Nombre de usuario", "username")}
              {renderField("Correo electrónico", "email", "email")}
              {renderField("Contraseña", "password", "password")}
              {renderField("Confirmar contraseña", "confirmPassword", "password")}
              {renderField("Fecha de nacimiento", "birthDate", "date")}
            </fieldset>
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default RegisterForm;
