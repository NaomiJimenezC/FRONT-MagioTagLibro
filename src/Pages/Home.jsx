import React from "react";
import Layout from "../Layout/MainLayout"; // Importa el Layout

function Home() {
  return (
    <Layout>
      <main role="main">
        <section>
          <header>
            <h2>Bienvenidos a Magio Taglibro</h2>
          </header>
          <p>
            Magio Taglibro es tu diario online personal y social. Aquí puedes
            compartir tus experiencias, reflexiones y momentos especiales con
            tus amigos, o simplemente escribir para ti mismo. ¡Explora, escribe
            y conecta!
          </p>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
