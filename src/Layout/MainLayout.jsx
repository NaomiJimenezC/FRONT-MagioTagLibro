import React from "react";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";



const Layout = ({ children }) => {
  return (
      <>
          {/* Encabezado principal con el Navbar */}
          <Navbar />


          {/* Contenido principal dinámico */}
          <main className="page-content" id="main-content" tabIndex="-1" aria-labelledby="main-content">
              {children}
          </main>

          {/* Pie de página */}
          <Footer />
      </>
  );
};

export default Layout;
