import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {useNavigate} from "react-router-dom";

const TodayEntry = () => {

    const navigate = useNavigate();
    const [user,setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate("/login");
        }
    }, []);


    const validationSchema = Yup.object().shape({
        palabras_clave: Yup.string()
            .matches(
                /^[a-zA-Z]+(\s*,\s*[a-zA-Z]+)*$/,
                'Ingresa las palabras separadas por coma'
            )
            .required('Este campo es requerido'),
        eventos_claves: Yup.string()
            .required('Este campo es requerido'),
        resumen: Yup.string()
            .required('Este campo es requerido'),
    });

    const initialValues = {
        palabras_clave: '',
        eventos_claves: '',
        resumen: ''
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 400);
    };

    return (
        <main>
            <section>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <fieldset>
                                <legend>Información del día</legend>

                                <label htmlFor="palabras_clave">Palabras clave:</label>
                                <Field
                                    name="palabras_clave"
                                    id="palabras_clave"
                                    placeholder="Ingrese las palabras claves de tu día"
                                />
                                <ErrorMessage name="palabras_clave" component="small" />

                                <label htmlFor="eventos_claves">Eventos clave:</label>
                                <Field
                                    name="eventos_claves"
                                    id="eventos_claves"
                                    placeholder="Ingrese los eventos claves"
                                />
                                <ErrorMessage name="eventos_claves" component="small" />

                                <label htmlFor="resumen">Resumen:</label>
                                <Field
                                    name="resumen"
                                    id="resumen"
                                    placeholder="Escribe el resumen de tu día"
                                    as="textarea"
                                    rows={6}
                                />
                                <ErrorMessage name="resumen" component="small" />

                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                                </button>
                            </fieldset>
                        </Form>
                    )}
                </Formik>
            </section>
        </main>
    );
};

export default TodayEntry;
