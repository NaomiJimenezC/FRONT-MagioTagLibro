import React from "react";
import Navbar from "../Components/NavBar.jsx"; 

function Home() {
  return (
    <body>
      <Navbar />
      <main role="main" >
        <h2>Bienvenidos a Magio Taglibro</h2>
        <p>
          Magio Taglibro es tu diario online personal y social. Aquí puedes
          compartir tus experiencias, reflexiones y momentos especiales con
          tus amigos, o simplemente escribir para ti mismo. ¡Explora, escribe
          y conecta!
        </p>
      </main>
    </body>
  );
}

export default Home;
