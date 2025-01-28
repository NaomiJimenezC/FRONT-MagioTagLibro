import React, { useState, useEffect } from "react";

const FriendManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]); // Solicitudes enviadas
  const [incomingRequests, setIncomingRequests] = useState([]); // Solicitudes recibidas
  const [friends, setFriends] = useState([]); // Amigos
  const [blockedUsers, setBlockedUsers] = useState([]); // Usuarios bloqueados
  const [friendUsername, setFriendUsername] = useState(""); // Nombre de usuario del amigo
  const [blockUsername, setBlockUsername] = useState(""); // Nombre de usuario para bloquear
  const [username, setUsername] = useState(null); // Nombre de usuario del usuario actual

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
  }, []);

  const fetchPendingRequests = async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/pending/${username}`
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

  const fetchIncomingRequests = async () => {
    if (!username) return;

    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/incoming/${username}`
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

  const fetchFriendsAndBlocked = async () => {
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
      fetchFriendsAndBlocked();
      fetchPendingRequests();
      fetchIncomingRequests();

      const interval = setInterval(() => {
        fetchFriendsAndBlocked();
        fetchPendingRequests();
        fetchIncomingRequests();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [username]);

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
      fetchFriendsAndBlocked();
      fetchPendingRequests();
      fetchIncomingRequests();
    } catch (error) {
      console.error(errorMessage, error.message);
      alert(`${errorMessage}: ${error.message}`);
    }
  };

  const sendFriendRequest = async () => {
    const isFriend = friends.some((friend) => friend.username === friendUsername);
    const isPendingRequest = pendingRequests.some(
      (request) => request.recipient.username === friendUsername
    );

    if (isFriend) {
      alert("Ya son amigos.");
      return;
    }
    if (isPendingRequest) {
      alert("Ya hay una solicitud pendiente con este usuario.");
      return;
    }

    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/request/${username}`,
      { friendUsername },
      "Solicitud de amistad enviada.",
      "Error enviando la solicitud de amistad."
    );
  };

  const acceptFriendRequest = (requesterUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/accept/${username}`,
      { friendUsername: requesterUsername },
      "Solicitud de amistad aceptada.",
      "Error aceptando la solicitud de amistad."
    );
  };

  const rejectFriendRequest = (requesterUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/reject/${username}`,
      { friendUsername: requesterUsername },
      "Solicitud de amistad rechazada.",
      "Error rechazando la solicitud de amistad."
    );
  };

  const cancelFriendRequest = (recipientUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/reject/${username}`,
      { friendUsername: recipientUsername },
      "Solicitud de amistad cancelada.",
      "Error cancelando la solicitud de amistad."
    );
  };

  const blockUser = (blockUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/block/${username}`,
      { blockUsername },
      "Usuario bloqueado.",
      "Error bloqueando el usuario."
    );
  };

  const unblockUser = (blockUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/unblock/${username}`,
      { blockUsername },
      "Usuario desbloqueado.",
      "Error desbloqueando el usuario."
    );
  };

  const removeFriend = (friendUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/remove/${username}`,
      { friendUsername },
      "Amigo eliminado.",
      "Error eliminando al amigo."
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
                  <button onClick={() => cancelFriendRequest(request.recipient.username)}>
                    Cancelar
                  </button>
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
                  <button onClick={() => acceptFriendRequest(request.requester.username)}>
                    Aceptar
                  </button>
                  <button onClick={() => rejectFriendRequest(request.requester.username)}>
                    Rechazar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes recibidas.</p>
          )}
        </section>

        <section>
          <h3>Lista de Amigos</h3>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li key={friend._id}>
                  {friend.username}
                  <button onClick={() => removeFriend(friend.username)}>Eliminar amigo</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes amigos.</p>
          )}
        </section>

        <section>
          <h3>Usuarios Bloqueados</h3>
          <input
            type="text"
            placeholder="Nombre de usuario a bloquear"
            value={blockUsername}
            onChange={(e) => setBlockUsername(e.target.value)}
          />
          <button onClick={() => blockUser(blockUsername)}>Añadir a bloqueados</button>
          {blockedUsers.length > 0 ? (
            <ul>
              {blockedUsers.map((user) => (
                <li key={user._id}>
                  {user.username}
                  <button onClick={() => unblockUser(user.username)}>Desbloquear</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes usuarios bloqueados.</p>
          )}
        </section>
      </article>
    </section>
  );
};

export default FriendManagement;
