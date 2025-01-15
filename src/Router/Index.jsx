import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import LoginRegister from "../Pages/LoginRegister";
import AuthTestPage from "../Pages/AuthTestPage"; // Asegúrate de importar el componente

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginRegister />,
  },
  {
    path: "/auth-test",  
    element: <AuthTestPage />,
  },
]);