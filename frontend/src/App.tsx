import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}