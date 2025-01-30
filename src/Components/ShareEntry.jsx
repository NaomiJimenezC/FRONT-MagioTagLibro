import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

/**
 * Componente para compartir una entrada con amigos.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.username - Nombre de usuario actual.
 * @param {string} props.idEntry - ID de la entrada a compartir.
 * @param {string[]} props.sharedWith - Lista de usuarios con los que ya se ha compartido la entrada.
 * @returns {JSX.Element} Formulario para compartir la entrada.
 */
const ShareEntry = ({ username, idEntry, sharedWith }) => {
  /** @type {[Object[], Function]} Estado para los resultados de búsqueda de amigos */
  const [searchResults, setSearchResults] = useState([]);
  /** @type {[Object[], Function]} Estado para la lista completa de amigos */
  const [friends, setFriends] = useState([]);
  /** @type {[string[], Function]} Estado para los usuarios con los que se ha compartido la entrada */
  const [sharedUsers, setSharedUsers] = useState([...sharedWith]);
  /** @type {[boolean, Function]} Estado para indicar si se está cargando la información */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {[string|null, Function]} Estado para manejar errores */
  const [error, setError] = useState(null);
  /** @type {string} URL del backend */
  const backurl = import.meta.env.VITE_BACKEND_URL;

  /** Esquema de validación para el formulario */
  const validationSchema = Yup.object().shape({
    selectedFriends: Yup.array()
      .min(1, 'Debes seleccionar al menos un amigo')
      .required('Debes seleccionar al menos un amigo')
  });

  /**
   * Efecto para cargar la lista de amigos al montar el componente.
   */
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backurl}/api/friendship/friends/${username}`);
        setFriends(response.data.friends);
        setSearchResults(response.data.friends);
        setError(null);
      } catch (error) {
        setError("Error al cargar los amigos. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [username, backurl]);

  /**
   * Maneja la búsqueda de amigos.
   * @param {string} value - Término de búsqueda.
   */
  const handleSearch = (value) => {
    if (value.trim() === '') {
      setSearchResults(friends);
    } else {
      const filteredFriends = friends.filter(friend => 
        friend.username.toLowerCase().includes(value.toLowerCase()) ||
        friend.email.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredFriends);
    }
  };

  /**
   * Maneja el envío del formulario para compartir la entrada.
   * @param {Object} values - Valores del formulario.
   * @param {Object} formikBag - Objeto con funciones y propiedades de Formik.
   */
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.patch(`${backurl}/api/entries/shared-entries/${idEntry}`, {
        shared_usernames: values.selectedFriends
      });
      setStatus({ success: 'Entrada compartida exitosamente' });
    } catch (error) {
      setStatus({ error: 'Error al compartir la entrada. Por favor, intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Cargando amigos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Formik
      initialValues={{ search: '', selectedFriends: sharedUsers }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue, isSubmitting, status }) => {
        const handleRemoveSharedUser = (userToRemove) => {
          setFieldValue('selectedFriends', values.selectedFriends.filter(user => user !== userToRemove));
        };


        return (
          <Form>
            {/* Campo de búsqueda */}
            <Field 
              name="search" 
              placeholder="Buscar amigos por nombre o email..."
              onChange={(e) => {
                setFieldValue('search', e.target.value);
                handleSearch(e.target.value);
              }}
            />
            <ErrorMessage name="selectedFriends" component="div" className="error-message" />
            {status && status.error && <div className="error-message">{status.error}</div>}
            {status && status.success && <div className="success-message">{status.success}</div>}
            
            {/* Lista de usuarios con los que ya se ha compartido */}
            <div>
              <h3>Ya compartido con:</h3>
              {sharedUsers.map((sharedUsername) => (
                <div key={sharedUsername}>
                  {sharedUsername}
                  <button type="button" onClick={() => handleRemoveSharedUser(sharedUsername)}>
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            
            {/* Lista de amigos para compartir */}
            <div>
              <h3>Compartir con:</h3>
              {searchResults.map((friend) => (
                <div key={friend._id}>
                  <label>
                    <Field 
                      type="checkbox" 
                      name="selectedFriends" 
                      value={friend.username} 
                      disabled={sharedUsers.includes(friend.username)}
                    />
                    {friend.username}
                    {sharedUsers.includes(friend.username) && " (ya compartido)"}
                  </label>
                </div>
              ))}
            </div>

            {/* Botón de envío */}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Compartiendo...' : 'Compartir'}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ShareEntry;
