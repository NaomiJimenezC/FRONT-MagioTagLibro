import React from "react";
import UserProfile from "../Components/UserProfile.jsx";
import Layout from "../Layout/MainLayout"; 

const User = () => {
  return (
    <Layout>
      <main role="main">
        <h1>Perfil de Usuario</h1>
        <UserProfile />
      </main>
    </Layout>
  );
}

export default User;
