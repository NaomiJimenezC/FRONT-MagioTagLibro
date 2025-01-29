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
      // Obtener amigos
      const friendsResponse = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/${username}`
      );
  
      if (!friendsResponse.ok) {
        console.error("Error fetching friend data:", friendsResponse.statusText);
        return;
      }
  
      const friendsData = await friendsResponse.json();
      setFriends(friendsData.friends || []);
  
      // Obtener bloqueados
      const blockedResponse = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/blocked/${username}`
      );
  
      if (!blockedResponse.ok) {
        console.error("Error fetching blocked users data:", blockedResponse.statusText);
        return;
      }
  
      const blockedData = await blockedResponse.json();
      setBlockedUsers(blockedData.blockedUsers || []);
  
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

  // Función para enviar una petición de amistad
  const sendFriendRequest = async () => {
    if (!friendUsername.trim()) {
      alert("Por favor ingresa un nombre de usuario válido.");
      return;
    }

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

  // Función para aceptar una petición de amistad
  const acceptFriendRequest = (requesterUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/accept/${username}`,
      { friendUsername: requesterUsername },
      "Solicitud de amistad aceptada.",
      "Error aceptando la solicitud de amistad."
    );
  };

  // función para rechazar una petición amistad
  const rejectFriendRequest = (requesterUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/reject/${username}`,
      { friendUsername: requesterUsername },
      "Solicitud de amistad rechazada.",
      "Error rechazando la solicitud de amistad."
    );
  };

  // Función para cancelar una petición de amistad
  const cancelFriendRequest = (recipientUsername) => {
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/cancel/${username}`,
      { friendUsername: recipientUsername },
      "Solicitud de amistad cancelada.",
      "Error cancelando la solicitud de amistad."
    );
  };

  // Función para blockear un usuario
  const blockUser = async (blockUsername) => {
    if (!blockUsername) {
      alert("El nombre de usuario no es válido.");
      return;
    }
  
    // Proceder a bloquear al usuario directamente
    try {
      await handlePostRequest(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/block/${username}`,
        { blockUsername },
        "Usuario bloqueado.",
        "Error bloqueando el usuario."
      );
      
      // Actualizar el estado de bloqueados después de bloquear
      setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, { username: blockUsername }]);
      alert("Usuario bloqueado correctamente.");
    } catch (error) {
      console.error("Error bloqueando el usuario:", error.message);
      alert("No se pudo bloquear al usuario.");
    }
  };
  
  
  

  
// Función para desbloquear un usuario
const unblockUser = async (unblockUsername) => {
  if (!unblockUsername) {
    alert("El nombre de usuario no es válido.");
    return;
  }

  try {
    // Hacer la solicitud para desbloquear al usuario
    await handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/unblock/${username}`,
      { blockUsername: unblockUsername },  // Cambié el parámetro para que coincida con el del backend
      "Usuario desbloqueado.",
      "Error desbloqueando el usuario."
    );

    // Eliminar al usuario de la lista de bloqueados
    setBlockedUsers((prevBlockedUsers) => prevBlockedUsers.filter(user => user.username !== unblockUsername));

    // Ya no agregamos el usuario a la lista de amigos, ya que la relación de amistad fue eliminada
    alert("Usuario desbloqueado correctamente.");
  } catch (error) {
    console.error("Error desbloqueando el usuario:", error.message);
    alert("No se pudo desbloquear al usuario.");
  }
};

  
  
// Función para eliminar amigos
  const removeFriend = async (friendUsername) => {
    try {
      const response = await fetch(
        `https://backend-magiotaglibro.onrender.com/api/friendship/friends/remove/${username}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendUsername }),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        alert("Amigo eliminado.");
      } else {
        alert(`Error eliminando al amigo: ${data.message}`);
      }
    } catch (error) {
      alert("Error eliminando al amigo.");
    }
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
    <p>No has bloqueado a nadie.</p>
  )}
</section>

      </article>
    </section>
  );
};

export default FriendManagement;
