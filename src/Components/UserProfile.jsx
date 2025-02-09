import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import FriendManagement from "../Components/FriendManagement";
import ProfileEditor from "../Components/ProfileEditor";
import "../Sass/components/_UserManagement.scss";
import "../Sass/components/_UserProfile.scss";
import "font-awesome/css/font-awesome.min.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [motto, setMotto] = useState("");
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setMotto(storedUser.motto || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen supera los 2MB. Por favor, selecciona otra.");
      return;
    }

    try {
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);
      const webpImage = canvas.toDataURL("image/webp", 0.8);
      
      const updatedUser = { ...user, profileImage: webpImage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
    }
  };

  return (
    <main id="user-profile-page">
      {user ? (
        <article id="profile-details">
          <section id="profile-summary">
            <figure>
              <img
                id="profile-avatar"
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt={`Avatar de ${user.username}`}
                className="profile-avatar"
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer" }}
              />
            </figure>

            <label htmlFor="file-input" style={{ cursor: "pointer" }}>
              Haz clic para cambiar la imagen
            </label>

            <input
                type="file"
                id="file-input"  // Asociado con el label
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />


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
                  onBlur={() => setIsEditingMotto(false)}
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

          <section>
            <button id="edit-profile-btn" onClick={() => setShowProfileModal(true)}>Editar perfil</button>
          </section>

          <section>
            <button id="manage-friends-btn" onClick={() => setShowFriendModal(true)}>
              Gestionar Amigos
            </button>
          </section>

          {showProfileModal && (
            <aside id="profile-modal" className="modal-overlay">
              <div className="modal-content">
                <button id="close-profile-modal" onClick={() => setShowProfileModal(false)} className="close-modal-btn">✕</button>
                <ProfileEditor user={user} onSave={() => setShowProfileModal(false)} />
              </div>
            </aside>
          )}

          {showFriendModal && (
            <aside id="friend-modal" className="modal-overlay">
              <div className="modal-content">
                <button id="close-friend-modal" onClick={() => setShowFriendModal(false)} className="close-modal-btn">✕</button>
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
