import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from './pages/Home/index.jsx';
import { Sobre } from './pages/Sobre/index.jsx';
import { Main } from './layouts/Main/index.jsx';

const router = createBrowserRouter([
  

   {
    element: <Main/>,
     children:[
       {
    path: "/",
    element: <Home/>,
       },
        {
    path: "sobre",
    element: <Sobre/>,
       },
     ] 
   },

  // {
  //   path: "/",
  //   element: <Home/>,
  // },
  // {
  //   path: "/sobre",
  //   element: <Sobre/>,
  // },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router} />,
    {/* <App /> */}
  </StrictMode>,
)
