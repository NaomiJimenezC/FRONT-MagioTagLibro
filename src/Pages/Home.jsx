import React from 'react';
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div>
      <header role="banner">
        <h1 >Magio Taglibro</h1>
        <nav aria-label="Acciones principales">
            <ul>
              <li><Link to="/Login" aria-label="Go to homepage">
                <button aria-label="Iniciar sesión en Magio Taglibro">
                  Inicio de Sesión
                </button>
                </Link>
              </li>
              <li>
                <button aria-label="Cambiar el modo de tema">
                  Modo de Tema
                </button>
              </li>
            </ul>
        </nav>
      </header>
      <section
        role="main"
      >
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
