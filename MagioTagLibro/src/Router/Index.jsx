import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Error404 from "../Pages/Error404";
import Login from "../Pages/Login";
import User from "../Pages/user";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, 
  },
  {
    path: "/user",
    element: <User />,
    requiresAuth: true,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <Error404 />,
  },
]);
