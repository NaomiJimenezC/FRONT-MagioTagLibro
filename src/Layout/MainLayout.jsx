import React from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";

const Layout = ({ children }) => {
  return (
    <section aria-labelledby="site-layout">
      {/* Encabezado principal con el Navbar */}
      <header aria-label="Primary navigation">
        <Navbar />
      </header>

      {/* Contenido principal dinámico */}
      <main id="main-content" tabIndex="-1" aria-labelledby="page-title">
        {children}
      </main>

      {/* Pie de página */}
      <footer aria-label="Site footer">
        <Footer />
      </footer>
    </section>
  );
};

export default Layout;
