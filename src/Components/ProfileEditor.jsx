import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileEditor = ({ user, onSave }) => {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthday, setBirthday] = useState(user.birthday || "");
  const [motto, setMotto] = useState(user.motto || "");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user.profileImage || "");
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  const handleLogoutAndRedirect = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("El tamaño de la imagen no puede ser mayor a 2MB.");
        setProfileImage(null);
        setProfileImagePreview("");
      } else {
        setImageError("");
        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleUsernameSave = async () => {
    if (username !== user.username) {
      try {
        const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/username`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });

        if (!response.ok) throw new Error("Error al actualizar el nombre de usuario");

        alert("Nombre de usuario actualizado correctamente");
        handleLogoutAndRedirect();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEmailSave = async () => {
    if (email !== user.email) {
      try {
        const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/email`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (!response.ok) throw new Error("Error al actualizar el correo electrónico");

        alert("Correo electrónico actualizado correctamente");
        handleLogoutAndRedirect();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleBirthdaySave = async () => {
    if (birthday !== user.birthday) {
      try {
        const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/birthdate`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthDate: birthday })
        });

        if (!response.ok) throw new Error("Error al actualizar la fecha de cumpleaños");

        alert("Fecha de cumpleaños actualizada correctamente");
        handleLogoutAndRedirect();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleProfileImageSave = async () => {
    if (!profileImage) {
      alert("No has seleccionado ninguna imagen.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
  
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/profile-image`, {
        method: "PATCH",
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error del backend: ${response.status} - ${errorMessage}`);
      }
  
      alert("Foto de perfil actualizada correctamente.");
      handleLogoutAndRedirect();
    } catch (error) {
      if (error.message.includes("Error del backend")) {
        alert(error.message);
      } else {
        alert(`Error en el frontend al subir la imagen: ${error.message}`);
      }
    }
  };
  

  const handleMottoSave = async () => {
    if (motto !== user.motto) {
      try {
        const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/${user.username}/update/motto`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motto })
        });

        if (!response.ok) throw new Error("Error al actualizar el lema");

        alert("Lema actualizado correctamente");
        handleLogoutAndRedirect();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <h3>Editar Perfil</h3>
      <form>
        <div>
          <label>Nombre de usuario:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button type="button" onClick={handleUsernameSave}>Guardar nombre de usuario</button>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" onClick={handleEmailSave}>Guardar correo electrónico</button>
        </div>
        <div>
          <label>Fecha de nacimiento:</label>
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          <button type="button" onClick={handleBirthdaySave}>Guardar fecha de nacimiento</button>
        </div>
        <div>
          <label>Lema:</label>
          <input type="text" value={motto} onChange={(e) => setMotto(e.target.value)} />
          <button type="button" onClick={handleMottoSave}>Guardar lema</button>
        </div>
        <div>
          <label>Imagen de perfil:</label>
          <input type="file" accept="image/jpeg, image/png" onChange={handleImageChange} />
          {imageError && <p style={{ color: "red" }}>{imageError}</p>}
          {profileImagePreview && <div><h4>Previsualización de la imagen:</h4><img src={profileImagePreview} alt="Previsualización del perfil" style={{ width: "100px", height: "100px" }} /></div>}
          <button type="button" onClick={handleProfileImageSave}>Guardar imagen de perfil</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
