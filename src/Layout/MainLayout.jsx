import React from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";



const Layout = ({ children }) => {
  return (
    <section className="father-layout" aria-labelledby="site-layout">
      {/* Encabezado principal con el Navbar */}
      <Navbar />


      {/* Contenido principal dinámico */}
      <main className="page-content" id="main-content" tabIndex="-1" aria-labelledby="page-title">
        {children}
      </main>

      {/* Pie de página */}
      <Footer />
    </section>
  );
};

export default Layout;
