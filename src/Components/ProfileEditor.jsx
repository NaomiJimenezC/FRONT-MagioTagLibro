import React, { useState, useEffect } from "react";

const ProfileEditor = ({ user, onSave }) => {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [birthday, setBirthday] = useState(user.birthday || "");
  const [motto, setMotto] = useState(user.motto || "");  // Nuevo estado para el lema
  const [profileImage, setProfileImage] = useState(null); // Para la imagen cargada
  const [profileImagePreview, setProfileImagePreview] = useState(user.profileImage || "");
  const [imageError, setImageError] = useState(""); // Estado para errores de imagen

  // Función para manejar la carga de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Comprobar el tamaño del archivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("El tamaño de la imagen no puede ser mayor a 2MB.");
        setProfileImage(null); // Resetear imagen cargada
        setProfileImagePreview(""); // Resetear previsualización
      } else {
        setImageError(""); // Limpiar mensaje de error
        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file)); // Previsualizar imagen
      }
    }
  };

  const handleUsernameSave = async () => {
    try {
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/update/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el nombre de usuario");
      }

      alert("Nombre de usuario actualizado correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const handleEmailSave = async () => {
    try {
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/update/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el correo electrónico");
      }

      alert("Correo electrónico actualizado correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const handleBirthdaySave = async () => {
    try {
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/update/birthdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ birthDate: birthday }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la fecha de cumpleaños");
      }

      alert("Fecha de cumpleaños actualizada correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  const handleProfileImageSave = async () => {
    if (profileImage) {
      try {
        const formData = new FormData();
        formData.append("profileImage", profileImage);

        const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/update/profile-image`, {
          method: "PUT",
          body: formData, // Usamos formData para manejar la imagen
        });

        if (!response.ok) {
          throw new Error("Error al actualizar la foto de perfil");
        }

        alert("Foto de perfil actualizada correctamente");
      } catch (error) {
        console.error("Error:", error.message);
        alert(error.message);
      }
    }
  };

  // Función para guardar el lema
  const handleMottoSave = async () => {
    try {
      const response = await fetch(`https://backend-magiotaglibro.onrender.com/api/userEditor/update/motto`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motto }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el lema");
      }

      alert("Lema actualizado correctamente");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <h3>Editar Perfil</h3>
      <form>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="button" onClick={handleUsernameSave}>
            Guardar nombre de usuario
          </button>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" onClick={handleEmailSave}>
            Guardar correo electrónico
          </button>
        </div>
        <div>
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <button type="button" onClick={handleBirthdaySave}>
            Guardar fecha de nacimiento
          </button>
        </div>
        <div>
          <label>Lema:</label>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)} // Actualizar el estado del lema
          />
          <button type="button" onClick={handleMottoSave}>
            Guardar lema
          </button>
        </div>
        <div>
          <label>Imagen de perfil:</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
          />
          {imageError && <p style={{ color: "red" }}>{imageError}</p>}
          {profileImagePreview && (
            <div>
              <h4>Previsualización de la imagen:</h4>
              <img src={profileImagePreview} alt="Previsualización del perfil" style={{ width: "100px", height: "100px" }} />
            </div>
          )}
          <button type="button" onClick={handleProfileImageSave}>
            Guardar imagen de perfil
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
