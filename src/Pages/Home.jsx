import React from "react";
import Layout from "../Layout/MainLayout"; // Importa el Layout
import "../Sass/pages/_Home.scss";


function Home() {
  return (
    <Layout>
      <main role="main">
        <section>
          <header>
            <h1>Bienvenidos a Magio Taglibro</h1>
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
