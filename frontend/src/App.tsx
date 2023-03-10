import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import ErrorPage from './pages/ErrorPage';
import TiernamentPage from './pages/TiernamentPage';
import HomePage from './pages/HomePage';
import Tiernament from './components/Tiernament';
import { loader as tiernamentLoader } from './pages/TiernamentPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'tiernament/',
    element: <TiernamentPage/>,
    errorElement: <ErrorPage />,
    loader: tiernamentLoader,
    children: [
        {
            path: ':tiernamentId',
            element: <Tiernament tiernamentId={'temp'}/>,
        },
    ],
  },
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}