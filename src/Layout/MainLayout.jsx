import React from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "../Sass/GlobalLayout.scss";


const Layout = ({ children }) => {
  return (
    <section className="father-layout" aria-labelledby="site-layout">
      {/* Encabezado principal con el Navbar */}
      <header className="head-bar" aria-label="Primary navigation">
        <Navbar />
      </header>

      {/* Contenido principal dinámico */}
      <main className="page-content" id="main-content" tabIndex="-1" aria-labelledby="page-title">
        {children}
      </main>

      {/* Pie de página */}
      <footer className="foot-bar" aria-label="Site footer">
        <Footer />
      </footer>
    </section>
  );
};

export default Layout;
