import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

const ShareEntry = ({ username }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const backurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${backurl}/api/friendship/${username}`);
        setFriends(response.data.friends); // Accedemos al array 'friends' de la respuesta
        setSearchResults(response.data.friends); // Mostrar todos los amigos por defecto
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [username, backurl]);

  const handleSearch = (value) => {
    if (value.trim() === '') {
      // Si el campo de búsqueda está vacío, mostramos todos los amigos
      setSearchResults(friends);
    } else {
      // Filtrar amigos por username o email
      const filteredFriends = friends.filter(friend => 
        friend.username.toLowerCase().includes(value.toLowerCase()) ||
        friend.email.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredFriends);
    }
  };

  return (
    <Formik
      initialValues={{ search: '', selectedFriends: [] }}
      onSubmit={(values) => {
        console.log('Compartir con:', values.selectedFriends);
        // Aquí iría la lógica para compartir la entrada
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Field 
            name="search" 
            placeholder="Buscar amigos por nombre o email..."
            onChange={(e) => {
              setFieldValue('search', e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <button type="submit">Compartir</button>
          
          <div>
            {searchResults.map((friend) => (
              <div key={friend._id}>
                <label>
                  <Field 
                    type="checkbox" 
                    name="selectedFriends" 
                    value={friend._id} 
                  />
                  {friend.username} ({friend.email})
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
