import React from "react";
import Layout from "../Layout/MainLayout"; // Importa el Layout
import "../Sass/pages/_Home.scss";
import {Link} from "react-router-dom";


function Home() {
  return (
    <Layout>
      <h1>¡Bienvenido a Magio Taglibro!<br/>¡El sitio donde tu vida es<br/>mágica!</h1>
      <h2>¿Qué te puede aportar esta página?</h2>
      <section className="home-contents" aria-labelledby={"home-contents"}>
        <p>
          <h2 id={"home-contents"}>Registro diario</h2>
          Con nuestra herramienta podrás organizar cómo ha ido tu día, pudiendo
          revisar cuando quieras lo que pasó en un día especial
        </p>
        <p>
          <h2 id={"home-contents-organization"}>Organización</h2>
          Usamos la técnica Cornell para ofrecer una organización óptima en las
          entradas del diario. Mejor organización, mejores resultados
        </p>
        <p>
          <h2 id={"home-contents-friendships"}>Amistades</h2>
          Puedes compartir tus entradas con tus amigos, para que puedan saber cómo
          te ha ido el día y cómo estás. ¡No dudes en hacerles saber cómo estás!
        </p>
      </section>
      <section className="start-writting">
        <h2>¿Cómo empiezo a escribir?</h2>
        <p>Para empezar a escribir tu diario mágico es sencillo, solo tienes que darle al siguiente botón:</p>
        <Link to="/diaries">
          <button>
            ¡A tu diario!
          </button>
        </Link>
      </section>
    </Layout>
  );
}

export default Home;
