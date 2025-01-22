import React from "react";
import Navbar from "../Components/NavBar"; 
import UserProfile from "../Components/UserProfile";

function User() {
  return (
    <body>
      <Navbar />
      <main role="main" >
        <UserProfile/>
        <p>
        Pasan cosas y cosas pasan.
        </p>
      </main>
    </body>
  );
}

export default User;
