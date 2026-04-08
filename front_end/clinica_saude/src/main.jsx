import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react-router
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";


//toastify
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Login } from './pages/Login';
import { Dashboad } from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/dashboard",
    element: <Dashboad/>
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ToastContainer/>
    <RouterProvider router={router} />

  </StrictMode>
)
