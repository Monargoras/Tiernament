import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import ErrorPage from './pages/ErrorPage';
import TiernamentPage from './pages/TiernamentPage';
import HomePage from './pages/HomePage';
import Tiernament from './components/Tiernament';
import { loader as tiernamentLoader } from './pages/TiernamentPage';
import { loader as tiernamentIdLoader } from './components/Tiernament';
import RootPage from './pages/RootPage';

export const AppBarRoutes: { [key: string]: string } = {
  Create: '/tiernament/create',
  About: '/about',
  Imprint: '/imprint',
}

export const UserMenuRoutes: { [key: string]: string } = {
  Profile: '/profile',
  Settings: '/settings',
  Logout: '/logout',
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'tiernament',
        element: <TiernamentPage />,
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
        path: 'about',
        element: <p>About</p>,
      },
      {
        path: 'profile',
        element: <p>Profile</p>,
      },
{
        path: 'settings',
        element: <p>Settings</p>,
      },
      {
        path: 'logout',
        element: <p>Logout</p>,
      },
      {
        path: 'imprint',
        element: <p>Imprint</p>,
      }
    ]
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}