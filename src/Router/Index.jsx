import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import LoginRegister from "../Pages/LoginRegister";
import AuthTestPage from "../Pages/AuthTestPage"; 
import User from "../Pages/User"
import Diaries from "../Pages/Diaries"

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
  {
    path: "/user",
    element: <User/>,
  },
  {
    path: "/diaries",
    element: <Diaries/>,
  },
]);