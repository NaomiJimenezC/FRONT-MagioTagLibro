import axios from 'axios';
import * as Yup from 'yup';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import React from 'react';
import Layout from '../Layout/MainLayout';
import "../Sass/pages/_Contact.scss";

export const Contact = () => {
    const backurl = import.meta.env.VITE_BACKEND_URL;
    const initialValues = {
        subject: '',
        email_user: '',
        email_body: ''
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post(`${backurl}/api/contact/sent`, values);
        } catch (error) {
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required("El asunto es requerido"),
        email_user: Yup.string().email("Formato de correo inválido").required("Correo obligatorio"),
        email_body: Yup.string().required("Es necesario describir el asunto")
    });

    return (
        <Layout>
            <section id="contact-intro">
                <h1>¡Contacta con nosotros!</h1>
                <p>En Magio Taglibro valoramos mucho el bienestar del usuario, debido a ello siempre estamos abiertos a escucharos. Déjanos en el formulario lo que veas necesario y te leeremos. ¡Muchas gracias!</p>
            </section>

            <section id="contact-form">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form id="form-container">
                            <fieldset id="form-fieldset">
                                <legend id="form-legend">Contacta con nosotros</legend>

                                <label htmlFor="subject" id="label-subject">Asunto</label>
                                <Field id="input-subject" as="input" name="subject" type="text" />
                                <ErrorMessage name="subject" id="error-subject" component="div" />

                                <label htmlFor="email_user" id="label-email">Email</label>
                                <Field id="input-email" as="input" name="email_user" type="email" />
                                <ErrorMessage name="email_user" id="error-email" component="div" />

                                <label htmlFor="email_body" id="label-message">Mensaje</label>
                                <Field id="textarea-message" name="email_body" as="textarea" rows={8} />
                                <ErrorMessage name="email_body" id="error-message" component="div" />

                                <button id="submit-button" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                                </button>
                            </fieldset>
                        </Form>
                    )}
                </Formik>
            </section>
        </Layout>
    );
};
