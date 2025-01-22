import React, { useState, useEffect } from "react";

const FriendManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [view, setView] = useState("addFriend");

  useEffect(() => {
    setPendingRequests([]);
    setIncomingRequests([]);
    setFriends([]);
    setBlockedUsers([]);
  }, []);

  const handleAddFriend = () => {
    console.log("Agregar amigo - abrir modal o procesar solicitud.");
  };

  const handleAcceptRequest = (userId) => {
    console.log(`Aceptar solicitud de: ${userId}`);
  };

  const handleRejectRequest = (userId) => {
    console.log(`Rechazar solicitud de: ${userId}`);
  };

  const handleBlockUser = (userId) => {
    console.log(`Bloquear usuario: ${userId}`);
  };

  const handleUnblockUser = (userId) => {
    console.log(`Desbloquear usuario: ${userId}`);
  };

  const handleRemoveFriend = (userId) => {
    console.log(`Eliminar amigo: ${userId}`);
  };

  return (
    <section aria-labelledby="friend-management-title">
      <header>
        <h2 id="friend-management-title">Gestión de Amigos</h2>
      </header>

      <nav aria-label="Gestión de amigos">
        <ul className="navigation-buttons">
          <li>
            <button onClick={() => setView("addFriend")}>Agregar Amigo</button>
          </li>
          <li>
            <button onClick={() => setView("pendingRequests")}>Solicitudes Pendientes</button>
          </li>
          <li>
            <button onClick={() => setView("incomingRequests")}>Solicitudes Entrantes</button>
          </li>
          <li>
            <button onClick={() => setView("friends")}>Lista de Amigos</button>
          </li>
          <li>
            <button onClick={() => setView("blockedUsers")}>Usuarios Bloqueados</button>
          </li>
        </ul>
      </nav>

      <article>
        {view === "addFriend" && (
          <section>
            <h3>Agregar Amigo</h3>
            <button onClick={handleAddFriend}>Enviar solicitud de amistad</button>
          </section>
        )}

        {view === "pendingRequests" && (
          <section>
            <h3>Solicitudes Pendientes</h3>
            {pendingRequests.length > 0 ? (
              <ul>
                {pendingRequests.map((request) => (
                  <li key={request.id}>
                    {request.username}
                    <button onClick={() => handleAcceptRequest(request.id)}>Aceptar</button>
                    <button onClick={() => handleRejectRequest(request.id)}>Rechazar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes solicitudes pendientes.</p>
            )}
          </section>
        )}

        {view === "incomingRequests" && (
          <section>
            <h3>Solicitudes Entrantes</h3>
            {incomingRequests.length > 0 ? (
              <ul>
                {incomingRequests.map((request) => (
                  <li key={request.id}>
                    {request.username}
                    <button onClick={() => handleAcceptRequest(request.id)}>Aceptar</button>
                    <button onClick={() => handleRejectRequest(request.id)}>Rechazar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes solicitudes entrantes.</p>
            )}
          </section>
        )}

        {view === "friends" && (
          <section>
            <h3>Lista de Amigos</h3>
            {friends.length > 0 ? (
              <ul>
                {friends.map((friend) => (
                  <li key={friend.id}>
                    {friend.username}
                    <button onClick={() => handleRemoveFriend(friend.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes amigos en tu lista.</p>
            )}
          </section>
        )}

        {view === "blockedUsers" && (
          <section>
            <h3>Usuarios Bloqueados</h3>
            {blockedUsers.length > 0 ? (
              <ul>
                {blockedUsers.map((user) => (
                  <li key={user.id}>
                    {user.username}
                    <button onClick={() => handleUnblockUser(user.id)}>Desbloquear</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes usuarios bloqueados.</p>
            )}
          </section>
        )}
      </article>
    </section>
  );
};

export default FriendManagement;
