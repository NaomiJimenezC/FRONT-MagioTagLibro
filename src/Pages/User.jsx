import React from "react";
import Navbar from "../Components/NavBar.jsx"; 
import UserProfile from "../Components/UserProfile.jsx";

function User() {
  return (
    <body>
      <Navbar />
      <main role="main" >
        <UserProfile/>
      </main>
    </body>
  );
}

export default User;
