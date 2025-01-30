import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import FriendManagement from "../Components/FriendManagement";
import ProfileEditor from "../Components/ProfileEditor";  // Importar el componente ProfileEditor
import "../Sass/components/_UserManagement.scss";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);  // Estado para el modal de editar perfil
  const [motto, setMotto] = useState(user ? user.motto : "");  // Estado para el motto
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setMotto(storedUser.motto);  // Inicializar el motto
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Función para abrir el popup de editar perfil
  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  // Función para cerrar el popup de editar perfil
  const closeProfileModal = async () => {
    setShowProfileModal(false);
    await fetchUserData();  // Volver a obtener los datos del usuario después de editar
  };

  // Obtener los datos del usuario después de cerrar el modal
  const fetchUserData = async () => {
    try {
      const response = await fetch("https://backend-magiotaglibro.onrender.com/api/user/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Suponiendo que el token de autenticación está en el localStorage
        },
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setMotto(updatedUser.motto);  // Actualizar el motto
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Guarda los nuevos datos en el localStorage
      } else {
        alert("Error al obtener los datos del usuario.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Hubo un error al obtener los datos.");
    }
  };

  // Función para abrir el modal de gestión de amigos
  const openFriendModal = () => {
    setShowFriendModal(true);
  };

  // Función para cerrar el modal de gestión de amigos
  const closeFriendModal = () => {
    setShowFriendModal(false);
  };

  // Función para guardar el motto
  const handleMottoSave = async () => {
    try {
      const response = await fetch("https://backend-magiotaglibro.onrender.com/api/userEditor/update/motto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motto }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el motto");
      }

      alert("Motto actualizado correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <main aria-labelledby="user-profile-title">
      <header>
        <h1 id="user-profile-title">Perfil de Usuario</h1>
      </header>

      {user ? (
        <article aria-labelledby="profile-details-title">
          <section id="profile-summary" aria-labelledby="profile-summary-title">
            <h2 id="profile-summary-title">Detalles del perfil</h2>
            <figure>
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}  // Usamos un placeholder si no hay imagen
                alt={`Avatar de ${user.username}`}
                className="profile-avatar"
              />
              <figcaption>
                Información del perfil de {user.username}.
              </figcaption>
            </figure>
            <p><strong>Nombre de usuario:</strong> {user.username}</p>
            <p><strong>Fecha de registro:</strong> {user.createdAt}</p>
            <p><strong>Motto:</strong> {user.motto}</p> {/* Mostrar el motto */}
            <button onClick={openProfileModal} className="edit-profile-btn">
              Editar perfil
            </button>
            <button onClick={handleMottoSave} className="save-motto-btn">
              Guardar Motto
            </button>
          </section>

          <section aria-labelledby="friend-management-title">
            <h2 id="friend-management-title" className="sr-only">
              Gestión de amigos
            </h2>
            <button
              onClick={openFriendModal}
              className="manage-friends-btn"
              aria-haspopup="dialog"
            >
              Gestionar Amigos
            </button>
          </section>

          {/* Modal para editar perfil */}
          {showProfileModal && (
            <aside
              className="modal-overlay"
              role="dialog"
              aria-labelledby="profile-editor-title"
              aria-modal="true"
            >
              <div className="modal-content">
                <button
                  onClick={closeProfileModal}
                  className="close-modal-btn"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
                <ProfileEditor user={user} onSave={closeProfileModal} />
              </div>
            </aside>
          )}

          {/* Modal para gestionar amigos */}
          {showFriendModal && (
            <aside
              className="modal-overlay"
              role="dialog"
              aria-labelledby="friend-management-title"
              aria-modal="true"
            >
              <div className="modal-content">
                <button
                  onClick={closeFriendModal}
                  className="close-modal-btn"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
                <FriendManagement />
              </div>
            </aside>
          )}
        </article>
      ) : (
        <section>
          <p>Cargando perfil...</p>
        </section>
      )}
    </main>
  );
};

export default UserProfile;
