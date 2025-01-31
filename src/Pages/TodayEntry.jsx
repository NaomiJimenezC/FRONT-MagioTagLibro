import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../Layout/MainLayout"; 
import ShareEntry from '../Components/ShareEntry';

const TodayEntry = () => {
    const [showFriendModal, setShowFriendModal] = useState(false);
    const [editable, setEditable] = useState(true);
    const [user, setUser] = useState(null);
    const [entry, setEntry] = useState(null);
    const [error, setError] = useState(null);


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
  const closeFriendModal = async () => {
    setShowFriendModal(false);
    // Recargar los datos de la entrada
    try {
      const response = await axios.get(`${backurl}/api/entries/${user.username}/${id}`);
      setEntry(response.data);
    } catch (error) {
      console.error("Error al recargar la entrada:", error);
    }
  };
  
    useEffect(() => {
        const fetchUserAndEntries = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
                try {
                    console.log(storedUser.username)
                    const response = await axios.get(`${backurl}/api/entries/${storedUser.username}/${id}`);
                    console.log(response.data)
                    setEntry(response.data);
                    setEditable(response.data.fecha_creacion === today);
                } catch (error) {
                    console.log("Error al obtener la entrada normal:", error);
                    try {
                        console.log("Intentando obtener entrada compartida...");
                        const sharedResponse = await axios.get(`${backurl}/api/entries/shared-entries/${storedUser.username}/${id}`);
                        console.log("Respuesta de entrada compartida:", sharedResponse);
                        setEntry(sharedResponse.data);
                        setEditable(false);
                    } catch (sharedError) {
                        console.error("Error al obtener entrada compartida:", sharedError);
                        setError(sharedError);
                        navigate("/");
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

    const handleDeleteClick = async() =>{
        try {
            const deletEntry = axios.delete(`${backurl}/api/entries/delete/${id}`)
            navigate("/diaries")
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditClick = (isEditable)=>{
        setEditable(prevState => !prevState);
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post(`${backurl}/api/entries/new`, values);
            navigate("/diaries")
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
                <section>
                    <h1>{entry.titulo}</h1>
                    <h3><strong>Fecha de creación:</strong> {entry.fecha_creacion}</h3>
                    <h3><strong>Autor(a):</strong>{entry.autor_username}</h3>

                    {entry.autor_username === user.username &&(
                        <>
                            <button
                                type="button"
                                onClick={openFriendModal}
                            >
                                Compartir
                            </button>

                            <button
                            type="button"
                            onClick={handleDeleteClick}>
                                Eliminar entrada
                            </button>
                            {entry.fecha_creacion === today &&(
                                <button
                                    type='button'
                                    onClick={handleEditClick}
                                >
                                    {editable ? "Vista":"Edición"}
                                </button>
                            )}
                        </>
                        
                    )}
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
                        {editable ? (
                            <>
                                <fieldset>
                                    <legend>Cambiar el título</legend>
                                    <label htmlFor="titulo">Título:</label>
                                    <Field
                                        name="titulo"
                                        id="titulo"
                                        type="text"
                                        placeholder="Título de la entrada"
                                    />
                                    <ErrorMessage name="titulo" component="small" />
                                </fieldset>
                                <fieldset>
                                    <legend>Información del día</legend>

                                    <div>
                                        <label htmlFor="contenido.palabras_clave">Palabras clave:</label>
                                        <Field
                                            name="contenido.palabras_clave"
                                            id="palabras_clave"
                                            placeholder="Ingrese las palabras claves de tu día"
                                        />
                                        <ErrorMessage name="contenido.palabras_clave" component="small" />
                                    </div>

                                    <div>
                                            <label htmlFor='contenido.eventos_clave'>Eventos Claves</label>
                                            {values.contenido.eventos_clave.map((evento, index) => (
                                                <div key={index}>
                                                    <Field
                                                        name={`contenido.eventos_clave[${index}]`}
                                                        placeholder={`Evento ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        aria-label="Eliminar evento"
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
                                                </div>
                                            ))}
                                    </div>

                                    <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFieldValue("contenido.eventos_clave", [...values.contenido.eventos_clave, ''])
                                                }
                                            >
                                                Agregar Evento
                                            </button>
                                    </div>

                                    <div>
                                            <label htmlFor="contenido.resumen">Resumen del día:</label>
                                            <Field
                                                name="contenido.resumen"
                                                id="resumen"
                                                as="textarea"
                                                rows={6}
                                                placeholder="Escribe el resumen de tu día"
                                            />
                                            <ErrorMessage name="contenido.resumen" component="small" />
                                    </div>

                                    <div>
                                            <button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? 'Enviando...' : 'Enviar'}
                                            </button>
                                    </div>
                                </fieldset>
                            </>
                        ) : (
                            <div>
                                <h3><strong>Palabras clave:</strong> </h3>
                                <p>{entry.contenido.palabras_clave}</p>
                                <h3><strong>Eventos Clave:</strong></h3>
                                <ul>
                                    {entry.contenido.eventos_clave.map((evento, index) => (
                                        <li key={index}>{evento}</li>
                                    ))}
                                </ul>
                                <h3><strong>Resumen del día:</strong></h3>
                                <p>{entry.contenido.resumen}</p>
                            </div>
                        )}
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
                            
                            <ShareEntry 
                                username={user.username} 
                                idEntry={id} 
                                sharedWith={entry.compartido_con}
                                onClose={closeFriendModal}
                             />
                            </div>
                        </aside>
                        )}
                    </article>
                    ) : (
                    <section>
                        <p>Cargando perfil...</p>
                    </section>
                    )}
        </Layout>
    );
};

export default TodayEntry;
