import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../Layout/MainLayout"; 
import ShareEntry from '../Components/ShareEntry';

const TodayEntry = () => {
    const [showFriendModal, setShowFriendModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const backurl = import.meta.env.VITE_BACKEND_URL;
    const today = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

      // Función para abrir el popup
  const openFriendModal = () => {
    setShowFriendModal(true);
  };

  // Función para cerrar el popup
  const closeFriendModal = () => {
    setShowFriendModal(false);
  };


    const [editable, setEditable] = useState(true);
    const [user, setUser] = useState(null);
    const [entry, setEntry] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserAndEntries = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
                try {
                    // Intenta obtener la entrada como autor
                    const response = await axios.get(`${backurl}/api/entries/${storedUser.username}/${id}`);
                    setEntry(response.data);
                    setEditable(response.data.fecha_creacion === today);
                } catch (error) {
                    try {
                        // Si falla, intenta obtener como entrada compartida
                        const sharedResponse = await axios.get(`${backurl}/api/entries/shared-entries/${storedUser.username}/${id}`);
                        setEntry(sharedResponse.data);
                        setEditable(false); // Las entradas compartidas no son editables
                    } catch (sharedError) {
                        setError(sharedError)
                        // Si ambas solicitudes fallan, el usuario no tiene acceso
                        console.error("Usuario no autorizado:", sharedError);
                        navigate("/"); // Redirige a una página de no autorizado
                    }
                }
            } else {
                navigate("/login");
            }
        };
        fetchUserAndEntries();
    }, [navigate, id, backurl, today]);

    const validationSchema = Yup.object().shape({
        titulo: Yup.string().required('El título es requerido'),
        contenido: Yup.object().shape({
            palabras_clave: Yup.string()
                .matches(
                    /^[a-zA-Z]+(\s*,\s*[a-zA-Z]+)*$/,
                    'Ingresa las palabras separadas por coma'
                )
                .required('Este campo es requerido'),
            eventos_clave: Yup.array()
                .of(Yup.string().required('Evento no puede estar vacío'))
                .min(1, 'Debe tener al menos un evento'),
            resumen: Yup.string()
                .required('Este campo es requerido'),
        }),
    });

    const initialValues = {
        titulo: entry?.titulo || new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        contenido: {
            palabras_clave: entry?.contenido?.palabras_clave || '',
            eventos_clave: entry?.contenido?.eventos_clave || [''],
            resumen: entry?.contenido?.resumen || ''
        },
        autor_username: user?.username || "",
        fecha_creacion: today,
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(`${backurl}/api/entries/new`, values);
            console.log(response.data);
        } catch (error) {
            console.error("Error submitting entry:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user || !entry) {
        return <div>Cargando...</div>;
    }

    return (
        <Layout>
            <main role="main">
                <section>
                    <h1>{entry.titulo}</h1>
                    <h2>Fecha de creación: {entry.fecha_creacion}</h2>
                    <button type="button"
                    onClick={openFriendModal}
                    >Compartir</button>
                    <img src="" alt="Descripción 2" />
                </section>
                <section>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                        enableReinitialize
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form>
                                <fieldset>
                                    <legend>Cambiar el título</legend>
                                    <label htmlFor="titulo">Título:</label>
                                    <Field
                                        name="titulo"
                                        id="titulo"
                                        type="text"
                                        placeholder="Título de la entrada"
                                        disabled={!editable}
                                    />
                                    <ErrorMessage name="titulo" component="small" />
                                </fieldset>
                                <fieldset>
                                    <legend>Información del día</legend>

                                    <label htmlFor="contenido.palabras_clave">Palabras clave:</label>
                                    <Field
                                        name="contenido.palabras_clave"
                                        id="palabras_clave"
                                        placeholder="Ingrese las palabras claves de tu día"
                                        disabled={!editable}
                                    />
                                    <ErrorMessage name="contenido.palabras_clave" component="small" />

                                    <fieldset>
                                        <legend>Eventos Clave</legend>
                                        {values.contenido.eventos_clave.map((evento, index) => (
                                            <section key={index}>
                                                <Field
                                                    name={`contenido.eventos_clave[${index}]`}
                                                    placeholder={`Evento ${index + 1}`}
                                                    disabled={!editable}
                                                />
                                                <button
                                                    type="button"
                                                    aria-label="Eliminar evento"
                                                    disabled={!editable}
                                                    onClick={() => {
                                                        const nuevosEventos = [...values.contenido.eventos_clave];
                                                        nuevosEventos.splice(index, 1);
                                                        setFieldValue("contenido.eventos_clave", nuevosEventos);
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                                <ErrorMessage
                                                    name={`contenido.eventos_clave[${index}]`}
                                                    component="small"
                                                />
                                            </section>
                                        ))}

                                        <section>
                                            <button
                                                type="button"
                                                disabled={!editable}
                                                onClick={() =>
                                                    setFieldValue("contenido.eventos_clave", [...values.contenido.eventos_clave, ''])
                                                }
                                            >
                                                Agregar Evento
                                            </button>
                                        </section>
                                    </fieldset>

                                    <label htmlFor="contenido.resumen">Resumen:</label>
                                    <Field
                                        name="contenido.resumen"
                                        id="resumen"
                                        as="textarea"
                                        rows={6}
                                        placeholder="Escribe el resumen de tu día"
                                        disabled={!editable}
                                    />
                                    <ErrorMessage name="contenido.resumen" component="small" />

                                    <button type="submit" disabled={!editable || isSubmitting}>
                                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </fieldset>
                            </Form>
                        )}
                    </Formik>
                </section>
                {user && id ? (
                    <article>    
                        {showFriendModal && (
                        <aside
                            className="modal-overlay"
                            role="dialog"
                            aria-labelledby="friend-management-title"
                            aria-modal="true"
                        >
                            <div className="modal-content">
                            <button
                                onClick={closeFriendModal}
                                className="close-modal-btn"
                                aria-label="Cerrar modal"
                            >
                                ✕
                            </button>
                            <h2 id="friend-management-title">Compartir entrada</h2>
                            <ShareEntry username={user.username} idEntry={id} onClose={closeFriendModal} />
                            </div>
                        </aside>
                        )}
                    </article>
                    ) : (
                    <section>
                        <p>Cargando perfil...</p>
                    </section>
                    )}
    
            </main>
        </Layout>
    );
};

export default TodayEntry;
