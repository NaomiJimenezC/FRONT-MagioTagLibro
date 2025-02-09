import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext"; 
import { AuthProvider } from "./Context/AuthContext"; 
import { router } from "./Router/Index.jsx";
import './Sass/GlobalLayout.scss';
import {HelmetProvider} from "react-helmet-async";
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HelmetProvider> {/* Envuelve toda la aplicación */}
            <ThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ThemeProvider>
        </HelmetProvider>
    </React.StrictMode>
);