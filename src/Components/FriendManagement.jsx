import React, { useState, useEffect } from "react";

const FriendManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // Solicitudes enviadas
  const [incomingRequests, setIncomingRequests] = useState([]); // Solicitudes recibidas
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");
  const [username, setUsername] = useState(null);

  // Obtener el usuario desde localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
  }, []);

  // Obtener solicitudes de amistad pendientes enviadas por el usuario
  const fetchPendingRequests = async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friends/pending/${username}`
      );

      if (!response.ok) {
        console.error("Error fetching pending requests:", response.statusText);
        return;
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
    } catch (error) {
      console.error("Error fetching pending requests:", error.message);
    }
  };

  // Obtener solicitudes de amistad recibidas por el usuario
  const fetchIncomingRequests = async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friends/incoming/${username}`
      );

      if (!response.ok) {
        console.error("Error fetching incoming requests:", response.statusText);
        return;
      }

      const data = await response.json();
      setIncomingRequests(data.incomingRequests || []);
    } catch (error) {
      console.error("Error fetching incoming requests:", error.message);
    }
  };

  // Obtener amigos y usuarios bloqueados
  const fetchFriendRequests = async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/${username}`
      );

      if (!response.ok) {
        console.error("Error fetching friend data:", response.statusText);
        return;
      }

      const data = await response.json();
      setFriends(data.friends || []);
      setBlockedUsers(data.blockedUsers || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error.message);
    }
  };

  useEffect(() => {
    if (username) {
      fetchFriendRequests();
      fetchPendingRequests();
      fetchIncomingRequests();

      const interval = setInterval(() => {
        fetchFriendRequests();
        fetchPendingRequests();
        fetchIncomingRequests();
      }, 15000); // Actualiza cada 15 segundos

      return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
    }
  }, [username]);

  // Función genérica para manejar solicitudes POST
  const handlePostRequest = async (url, body, successMessage, errorMessage) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unknown error");
      }

      alert(successMessage);
      fetchFriendRequests();
      fetchPendingRequests();
      fetchIncomingRequests();
    } catch (error) {
      console.error(errorMessage, error.message);
      alert(`${errorMessage}: ${error.message}`);
    }
  };

  const sendFriendRequest = async () => {
    const isFriend = friends.some(friend => friend.username === friendUsername);
    const isPendingRequest = pendingRequests.some(request => request.recipient.username === friendUsername);

    if (isFriend) {
      alert("Ya son amigos.");
      return;
    }
    if (isPendingRequest) {
      alert("Ya hay una solicitud pendiente con este usuario.");
      return;
    }

    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friendship/friends/request/" + username,
      { friendUsername },
      "Solicitud de amistad enviada.",
      "Error enviando la solicitud de amistad."
    );
  };

  return (
    <section aria-labelledby="friend-management-title">
      <header>
        <h2 id="friend-management-title">Gestión de Solicitudes de Amistad</h2>
      </header>

      <article>
        <section>
          <h3>Enviar Solicitud de Amistad</h3>
          <input
            type="text"
            placeholder="Nombre de usuario del amigo"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
          />
          <button onClick={sendFriendRequest}>Enviar solicitud</button>
        </section>

        <section>
          <h3>Solicitudes Pendientes</h3>
          {pendingRequests.length > 0 ? (
            <ul>
              {pendingRequests.map((request) => (
                <li key={request._id}>
                  {request.recipient.username}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes pendientes.</p>
          )}
        </section>

        <section>
          <h3>Solicitudes Recibidas</h3>
          {incomingRequests.length > 0 ? (
            <ul>
              {incomingRequests.map((request) => (
                <li key={request._id}>
                  {request.requester.username}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes recibidas.</p>
          )}
        </section>
      </article>
    </section>
  );
};

export default FriendManagement;
