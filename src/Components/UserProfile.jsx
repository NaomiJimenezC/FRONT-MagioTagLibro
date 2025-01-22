import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import FriendManagement from "../Components/FriendManagement";  
import "../Sass/components/_UserManagement.scss";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Función para abrir el popup
  const openFriendModal = () => {
    setShowFriendModal(true);
  };

  // Función para cerrar el popup
  const closeFriendModal = () => {
    setShowFriendModal(false);
  };

  return (
    <main aria-labelledby="user-profile-title">
      <header>
        <h1 id="user-profile-title">Perfil de Usuario</h1>
        <button
          onClick={logout}
          className="logout-btn"
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </header>

      {user ? (
        <article aria-labelledby="profile-details-title">
          <section id="profile-summary" aria-labelledby="profile-summary-title">
            <h2 id="profile-summary-title">Detalles del perfil</h2>
            <figure>
              <img
                src={`https://www.gravatar.com/avatar/${user.email}`}
                alt={`Avatar de ${user.username}`}
                className="profile-avatar"
              />
              <figcaption>
                Información del perfil de {user.username}.
              </figcaption>
            </figure>
            <p><strong>Nombre de usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Fecha de registro:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
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
