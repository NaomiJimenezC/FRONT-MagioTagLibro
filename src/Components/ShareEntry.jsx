import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ShareEntry = ({ username, idEntry }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backurl = import.meta.env.VITE_BACKEND_URL;

  const validationSchema = Yup.object().shape({
    selectedFriends: Yup.array()
      .min(1, 'Debes seleccionar al menos un amigo')
      .required('Debes seleccionar al menos un amigo')
  });

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
      initialValues={{ search: '', selectedFriends: [] }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ values, setFieldValue, isSubmitting, status }) => (
        <Form>
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Compartiendo...' : 'Compartir'}
          </button>
          
          <div>
            {searchResults.map((friend) => (
              <div key={friend._id}>
                <label>
                  <Field 
                    type="checkbox" 
                    name="selectedFriends" 
                    value={friend.username} 
                  />
                  {friend.username}
                </label>
              </div>
            ))}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ShareEntry;
