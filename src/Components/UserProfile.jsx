import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Simular la carga de datos del usuario desde el contexto o el almacenamiento local
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login"); // Redirigir si no hay usuario en el localStorage
    }
  }, [navigate]);

  const handleAddFriend = () => {
    alert("Funcionalidad de agregar amigos aún no está implementada.");
  };

  return (
    <section aria-labelledby="user-profile-title">
      <h1 id="user-profile-title">Perfil de Usuario</h1>
      {user ? (
        <div className="profile-container">
          <div className="profile-header">
            <img
              src={`https://www.gravatar.com/avatar/${user.email}`}
              alt="Avatar"
              className="profile-avatar"
            />
            <div className="profile-details">
              <h2>{user.username}</h2>
              <p>{user.email}</p>
              <p>Fecha de Registro: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={handleAddFriend}
              disabled={true}
              className="add-friend-btn"
            >
              Agregar Amigos
            </button>
          </div>

          <div className="profile-footer">
            <button onClick={logout} className="logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </section>
  );
};

export default UserProfile;
