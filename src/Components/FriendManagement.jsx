import React, { useState, useEffect } from "react";

const FriendManagement = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [view, setView] = useState("addFriend");
  const [userId, setUserId] = useState(null);


  const testConnection = async () => {
    try {
      const response = await fetch("https://backend-magiotaglibro.onrender.com/api/test");
      if (response.ok) {
        console.log("Conexión exitosa");
      } else {
        console.log("Error en la conexion de la base de datos", response.status);
      }
    } catch (error) {
      console.log("Error al conectar con el servidor", error);
    }
  };
  
  testConnection(); // Llama esta función para verificar
  

  // Obtener el usuario desde localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  // Obtener los datos iniciales del usuario
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/friends?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            const { friends, pendingRequests, incomingRequests, blockedUsers } = data;
            setFriends(friends);
            setPendingRequests(pendingRequests);
            setIncomingRequests(incomingRequests);
            setBlockedUsers(blockedUsers);
          } else {
            console.error("Error fetching friend data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching friend data:", error);
        }
      };
      fetchData();
    }
  }, [userId]);

  const handlePostRequest = async (url, body, successMessage, errorMessage) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        alert(successMessage);
      } else {
        const errorData = await response.json();
        console.error(errorMessage, errorData.message);
        alert(errorMessage);
      }
    } catch (error) {
      console.error(errorMessage, error);
      alert(errorMessage);
    }
  };

  const sendFriendRequest = async (friendId) => {
    if (!friendId) {
      alert("Por favor, ingresa un ID de amigo válido.");
      return;
    }
  
    try {
      const response = await fetch("https://backend-magiotaglibro.onrender.com/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,       // Este es el ID del usuario actual
          friendId,     // Este es el ID del amigo al que se le está enviando la solicitud
        }),
      });
  
      const data = await response.json(); // Asegúrate de obtener la respuesta en formato JSON
  
      if (response.ok) {
        console.log(data.message); // Muestra el mensaje de éxito en consola
        alert("Solicitud de amistad enviada correctamente.");
      } else {
        console.error(data.message || "Error al enviar la solicitud de amistad.");
        alert(data.message || "Error al enviar la solicitud de amistad.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error); // Muestra el error completo en consola
      alert("Ocurrió un error al conectar con el servidor.");
    }
  };
  
  

  const handleAcceptRequest = (friendId) => {
    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friends/accept",
      { userId, friendId },
      "Solicitud aceptada.",
      "Error al aceptar la solicitud."
    ).then(() => {
      setFriends((prev) => [...prev, { id: friendId }]);
      setIncomingRequests((prev) => prev.filter((req) => req.id !== friendId));
    });
  };

  const handleRejectRequest = (friendId) => {
    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friends/reject",
      { userId, friendId },
      "Solicitud rechazada.",
      "Error al rechazar la solicitud."
    ).then(() => {
      setIncomingRequests((prev) => prev.filter((req) => req.id !== friendId));
    });
  };

  const handleBlockUser = (blockId) => {
    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friends/block",
      { userId, blockId },
      "Usuario bloqueado.",
      "Error al bloquear al usuario."
    ).then(() => {
      setBlockedUsers((prev) => [...prev, { id: blockId }]);
      setFriends((prev) => prev.filter((friend) => friend.id !== blockId));
    });
  };

  const handleUnblockUser = (unblockId) => {
    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friends/unblock",
      { userId, unblockId },
      "Usuario desbloqueado.",
      "Error al desbloquear al usuario."
    ).then(() => {
      setBlockedUsers((prev) => prev.filter((user) => user.id !== unblockId));
    });
  };

  const handleRemoveFriend = (friendId) => {
    handlePostRequest(
      "https://backend-magiotaglibro.onrender.com/api/friends/remove",
      { userId, friendId },
      "Amigo eliminado.",
      "Error al eliminar al amigo."
    ).then(() => {
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    });
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
            <input
              type="text"
              placeholder="ID del amigo"
              id="friendIdInput"
            />
            <button
              onClick={() => {
                const friendId = document.getElementById("friendIdInput").value;
                sendFriendRequest(friendId);
              }}
            >
              Enviar solicitud de amistad
            </button>
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
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes solicitudes pendientes.</p>
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
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes amigos.</p>
            )}
          </section>
        )}
      </article>
    </section>
  );
};

export default FriendManagement;
