import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import FriendManagement from "../Components/FriendManagement";
import ProfileEditor from "../Components/ProfileEditor";
import "../Sass/components/_UserManagement.scss";
import 'font-awesome/css/font-awesome.min.css'; // Asegúrate de importar FontAwesome

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [motto, setMotto] = useState("");
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setMotto(storedUser.motto || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    // No es necesario hacer fetchUserData aquí, los datos ya están en el estado.
  };

  const handleMottoSave = async () => {
    try {
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/motto`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motto }),
      });
      if (!response.ok) throw new Error("Error al actualizar el motto");
      
      // Actualizar el motto en el estado del usuario
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, motto };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Guardar en localStorage
        return updatedUser;  // Devolver el usuario actualizado
      });

      alert("Motto actualizado correctamente");
      setIsEditingMotto(false);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const openFriendModal = () => {
    setShowFriendModal(true);
  };

  const closeFriendModal = () => {
    setShowFriendModal(false);
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
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt={`Avatar de ${user.username}`}
                className="profile-avatar"
              />
              <figcaption>
                Información del perfil de {user.username}.
              </figcaption>
            </figure>
            <p><strong>Nombre de usuario:</strong> {user.username}</p>
            <p><strong>Fecha de registro:</strong> {user.createdAt}</p>
            <p>
              <strong>Motto:</strong> 
              {isEditingMotto ? (
                <input 
                  type="text" 
                  value={motto} 
                  maxLength={125} 
                  onChange={(e) => setMotto(e.target.value)} 
                  onBlur={handleMottoSave} 
                  autoFocus
                />
              ) : (
                <span onClick={() => setIsEditingMotto(true)}>
                  {motto || "Haz clic para agregar un motto"}
                  <i className="fa fa-pencil-square-o" style={{ cursor: "pointer", marginLeft: "8px" }}></i>
                </span>
              )}
            </p>
          </section>

          <section aria-labelledby="user-editor.botton">
            <button onClick={openProfileModal}>
              Editar perfil
            </button>
          </section>

          <section aria-labelledby="friend-management-title">
            <button
              onClick={openFriendModal}
              className="manage-friends-btn"
              aria-haspopup="dialog"
            >
              Gestionar Amigos
            </button>
          </section>

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
