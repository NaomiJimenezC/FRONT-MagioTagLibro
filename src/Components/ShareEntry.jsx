import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
const ShareEntry = ({ username, idEntry, sharedWith,onClose  }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sharedUsers, setSharedUsers] = useState(Array.isArray(sharedWith) ? [...sharedWith] : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backurl = import.meta.env.VITE_BACKEND_URL;

  // Cargar la lista de amigos
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backurl}/api/friendship/friends/${username}`);
        if (response.data && Array.isArray(response.data.friends)) {
          setFriends(response.data.friends);
          setSearchResults(response.data.friends);
        } else {
          throw new Error('Formato inesperado en la respuesta del servidor');
        }
        setError(null);
      } catch (error) {
        console.error('Error al cargar los amigos:', error);
        setError('Error al cargar los amigos. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [username, backurl]);

  // Manejar búsqueda en tiempo real
  const handleSearch = (value) => {
    if (!value.trim()) {
      setSearchResults(friends);
    } else {
      const filteredFriends = friends.filter(
          (friend) =>
              friend.username.toLowerCase().includes(value.toLowerCase()) ||
              friend.email.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredFriends);
    }
  };

  // Enviar formulario
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.patch(`${backurl}/api/entries/shared-entries/${idEntry}`, {
        shared_usernames: values.selectedFriends,
      });
      setSharedUsers(values.selectedFriends);

      onClose()
      setStatus({ success: 'Entrada compartida exitosamente' });
    } catch (error) {
      console.error('Error al compartir la entrada:', error);
      setStatus({ error: 'Error al compartir la entrada. Por favor, intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Cargando amigos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
      <Formik
          initialValues={{ search: '', selectedFriends: sharedUsers }}
          onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, status }) => {
          // Eliminar usuario compartido
          const handleRemoveSharedUser = (userToRemove) => {
            const updatedSharedUsers = sharedUsers.filter((user) => user !== userToRemove);
            setSharedUsers(updatedSharedUsers);
            setFieldValue('selectedFriends', updatedSharedUsers);
          };

          // Verificar si hay modificaciones en la lista
          const isModified =
              JSON.stringify(sharedWith.sort()) !== JSON.stringify(values.selectedFriends.sort());

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
                  {sharedUsers.length > 0 ? (
                      sharedUsers.map((sharedUsername) => (
                          <div key={sharedUsername}>
                            {sharedUsername}
                            <button type="button" onClick={() => handleRemoveSharedUser(sharedUsername)}>
                              Quitar
                            </button>
                          </div>
                      ))
                  ) : (
                      <p>No hay usuarios con los que se haya compartido esta entrada.</p>
                  )}
                </div>

                {/* Lista de amigos para compartir */}
                <div>
                  <h3>Compartir con:</h3>
                  {searchResults.length > 0 ? (
                      searchResults.map((friend) => (
                          <div key={friend._id}>
                            <label>
                              <Field
                                  type="checkbox"
                                  name="selectedFriends"
                                  value={friend.username}
                                  disabled={sharedUsers.includes(friend.username)}
                              />
                              {friend.username}
                              {sharedUsers.includes(friend.username) && ' (ya compartido)'}
                            </label>
                          </div>
                      ))
                  ) : (
                      <p>No se encontraron amigos.</p>
                  )}
                </div>

                {/* Botón de envío */}
                <button type="submit" disabled={!isModified || isSubmitting}>
                  {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                </button>
              </Form>
          );
        }}
      </Formik>
  );
};

export default ShareEntry;
