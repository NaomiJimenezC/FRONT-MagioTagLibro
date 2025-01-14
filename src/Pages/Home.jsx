import React from 'react';

function Home() {
  return (
    <main>
      <header
        role="banner"
      >
        <h1 >Magio Taglibro</h1>
        <nav aria-label="Acciones principales">
          <ul>
            <li>
              <button
                aria-label="Iniciar sesión en Magio Taglibro"
              >
                Inicio de Sesión
              </button>
            </li>
            <li>
              <button
                aria-label="Cambiar el modo de tema"
              >
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
    </main>
  );
}

export default Home;
