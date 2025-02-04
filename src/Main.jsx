import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext"; 
import { AuthProvider } from "./Context/AuthContext"; 
import { router } from "./Router/Index.jsx";
import './Sass/GlobalLayout.scss'; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
