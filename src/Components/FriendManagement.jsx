import React, { useState, useEffect } from "react";

const FriendManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]); 
  const [incomingRequests, setIncomingRequests] = useState([]); 
  const [friends, setFriends] = useState([]); 
  const [blockedUsers, setBlockedUsers] = useState([]); 
  const [friendUsername, setFriendUsername] = useState(""); 
  const [blockUsername, setBlockUsername] = useState(""); 
  const [username, setUsername] = useState(null); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) setUsername(storedUser.username);
  }, []);

  useEffect(() => {
    if (!username) return;
    const fetchData = async () => {
      try {
        const [friendsRes, blockedRes, pendingRes, incomingRes] = await Promise.all([
          fetch(`https://backend-magiotaglibro.onrender.com/api/friendship/friends/${username}`),
          fetch(`https://backend-magiotaglibro.onrender.com/api/friendship/friends/blocked/${username}`),
          fetch(`https://backend-magiotaglibro.onrender.com/api/friendship/friends/pending/${username}`),
          fetch(`https://backend-magiotaglibro.onrender.com/api/friendship/friends/incoming/${username}`)
        ]);

        const [friendsData, blockedData, pendingData, incomingData] = await Promise.all([ 
          friendsRes.json(), 
          blockedRes.json(), 
          pendingRes.json(), 
          incomingRes.json()
        ]);

        setFriends(friendsData.friends || []);
        setBlockedUsers(blockedData.blockedUsers || []);
        setPendingRequests(pendingData.pendingRequests || []);
        setIncomingRequests(incomingData.incomingRequests || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [username]);

  const handlePostRequest = async (url, body, successMessage, errorMessage) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error((await response.json()).message || "Unknown error");

      alert(successMessage);
      setTimeout(() => fetchData(), 500);  // Refrescar después de la acción
    } catch (error) {
      alert(`${errorMessage}: ${error.message}`);
    }
  };

  const sendFriendRequest = () => {
    if (!friendUsername.trim()) return alert("Por favor ingresa un nombre de usuario válido.");
    const isFriend = friends.some((friend) => friend.username === friendUsername);
    const isPendingRequest = pendingRequests.some((request) => request.recipient.username === friendUsername);
    if (isFriend) return alert("Ya son amigos.");
    if (isPendingRequest) return alert("Ya hay una solicitud pendiente.");

    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/request/${username}`,
      { friendUsername },
      "Solicitud de amistad enviada.",
      "Error enviando la solicitud de amistad."
    );
  };

  const acceptFriendRequest = (requesterUsername) => handlePostRequest(
    `https://backend-magiotaglibro.onrender.com/api/friendship/friends/accept/${username}`,
    { friendUsername: requesterUsername },
    "Solicitud de amistad aceptada.",
    "Error aceptando la solicitud de amistad."
  );

  const rejectFriendRequest = (requesterUsername) => handlePostRequest(
    `https://backend-magiotaglibro.onrender.com/api/friendship/friends/reject/${username}`,
    { friendUsername: requesterUsername },
    "Solicitud de amistad rechazada.",
    "Error rechazando la solicitud de amistad."
  );

  const cancelFriendRequest = (recipientUsername) => handlePostRequest(
    `https://backend-magiotaglibro.onrender.com/api/friendship/friends/cancel/${username}`,
    { friendUsername: recipientUsername },
    "Solicitud de amistad cancelada.",
    "Error cancelando la solicitud de amistad."
  );

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
        setFriends(friends.filter((friend) => friend.username !== friendUsername));  // Actualiza localmente
        alert("Amigo eliminado.");
      } else {
        alert(`Error eliminando al amigo: ${data.message}`);
      }
    } catch {
      alert("Error eliminando al amigo.");
    }
  };

  const blockUser = async (blockUsername) => {
    if (!blockUsername) return alert("El nombre de usuario no es válido.");
    if (friends.some((friend) => friend.username === blockUsername)) {
      try {
        await removeFriend(blockUsername);
        alert("Amigo eliminado antes de bloquear.");
      } catch {
        return alert("No se pudo eliminar al amigo antes de bloquear.");
      }
    }
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/block/${username}`,
      { blockUsername },
      "Usuario bloqueado.",
      "Error bloqueando el usuario."
    );
  };

  const unblockUser = async (unblockUsername) => {
    if (!unblockUsername) return alert("El nombre de usuario no es válido.");
    handlePostRequest(
      `https://backend-magiotaglibro.onrender.com/api/friendship/friends/unblock/${username}`,
      { unblockUsername },
      "Usuario desbloqueado.",
      "Error desbloqueando el usuario."
    );
  };

  return (
    <section>
      <header>
        <h2>Gestión de Solicitudes de Amistad</h2>
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
          {pendingRequests.length ? (
            <ul>
              {pendingRequests.map((request) => (
                <li key={request._id}>
                  {request.recipient.username}
                  <button onClick={() => cancelFriendRequest(request.recipient.username)}>Cancelar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes pendientes.</p>
          )}
        </section>

        <section>
          <h3>Solicitudes Recibidas</h3>
          {incomingRequests.length ? (
            <ul>
              {incomingRequests.map((request) => (
                <li key={request._id}>
                  {request.requester.username}
                  <button onClick={() => acceptFriendRequest(request.requester.username)}>Aceptar</button>
                  <button onClick={() => rejectFriendRequest(request.requester.username)}>Rechazar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes solicitudes recibidas.</p>
          )}
        </section>

        <section>
          <h3>Lista de Amigos</h3>
          {friends.length ? (
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
          {blockedUsers.length ? (
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
