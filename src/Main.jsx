import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext"; // Importa el contexto de tema
import { AuthProvider } from "./Context/AuthContext"; // Importa el contexto de autenticación
import { router } from "./router/Index";
import "./sass/global.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
