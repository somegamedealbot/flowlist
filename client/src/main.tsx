import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import './index.css'
import ErrorPage from './routes/error-page';
import Login from './routes/login';
import Home from './routes/home';
import { Auth } from './routes/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/login',
    element: <Login></Login>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path: '/home',
    element: <Auth>
        <Home></Home>
      </Auth>,
    errorElement: <ErrorPage></ErrorPage>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
