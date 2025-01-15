import React from "react";
import Navbar from "../Components/Navbar"; 

function Home() {
  return (
    <div>
      <Navbar />
      <section role="main" style={{ padding: "2rem" }}>
        <h2>Bienvenidos a Magio Taglibro</h2>
        <p>
          Magio Taglibro es tu diario online personal y social. Aquí puedes
          compartir tus experiencias, reflexiones y momentos especiales con
          tus amigos, o simplemente escribir para ti mismo. ¡Explora, escribe
          y conecta!
        </p>
      </section>
    </div>
  );
}

export default Home;
