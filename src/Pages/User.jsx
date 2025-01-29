import React from "react";
import UserProfile from "../Components/UserProfile.jsx";
import Layout from "../Layout/MainLayout"; 

const User = () => {
  return (
    <Layout>
      <main role="main">
        <UserProfile />
      </main>
    </Layout>
  );
}

export default User;
