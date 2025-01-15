import React from "react";
import Navbar from "../Components/Navbar"; 

function User() {
  return (
    <div>
      <Navbar />
      <section role="main" style={{ padding: "2rem" }}>
        <h2>Aquí irá el usuario</h2>
        <p>
        Pasan cosas y cosas pasan.
        </p>
      </section>
    </div>
  );
}

export default User;
