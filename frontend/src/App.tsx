import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import ErrorPage from './pages/ErrorPage';
import TiernamentPage from './pages/TiernamentPage';
import HomePage from './pages/HomePage';
import Tiernament from './components/Tiernament';
import { loader as tiernamentLoader } from './pages/TiernamentPage';
import { loader as tiernamentIdLoader } from './components/Tiernament';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'tiernament',
    element: <TiernamentPage />,
    errorElement: <ErrorPage />,
    loader: tiernamentLoader,
  },
  {
    path: 'tiernament/:tiernamentId',
    element: <Tiernament />,
    loader: (args) => tiernamentIdLoader(args.params as { tiernamentId: string }),
  },
  {
    path: 'tiernament/create',
    element: <p>Create</p>,
  },
  {
    path: 'tiernament/edit/:tiernamentId',
    element: <p>Edit</p>,
  },
  {
    path: 'tiernament/search/:searchTerm',
    element: <p>Search</p>,
  },
  {
    path: 'account',
    element: <p>Account</p>,
  },
  {
    path: 'imprint',
    element: <p>Imprint</p>,
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}