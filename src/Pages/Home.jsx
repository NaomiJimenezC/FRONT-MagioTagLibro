import React from "react";
import Layout from "../Layout/MainLayout"; // Importa el Layout
import "../Sass/pages/_Home.scss";
import {Link, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";


function Home() {
  const navigate = useNavigate();

  const handleStartWriting = () => {
    navigate('/diaries');
  };
  return (
    <Layout>
        <Helmet>
            <title>Inicio - Magio Taglibro</title>
            <meta
                name="description"
                content="Bienvenido a Magio Taglibro, el sitio donde tu vida es mágica. Organiza tu día, comparte con amigos y crea recuerdos inolvidables."
            />
            <meta name="keywords" content="diario, organización, amistades, Cornell, Magio Taglibro" />
            <meta name="author" content="Magio Taglibro Team" />
        </Helmet>

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

        <button onClick={handleStartWriting}>
            ¡A tu diario!
        </button>

      </section>
    </Layout>
  );
}

export default Home;
