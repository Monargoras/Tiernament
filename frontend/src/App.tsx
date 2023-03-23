import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import './App.css';
import ErrorPage from './pages/ErrorPage';
import TiernamentPage from './pages/TiernamentPage';
import HomePage from './pages/HomePage';
import Tiernament from './components/tiernament/Tiernament';
import { loader as tiernamentLoader } from './pages/TiernamentPage';
import { loader as tiernamentIdLoader } from './components/tiernament/Tiernament';
import RootPage from './pages/RootPage';
import AuthenticationPage from './pages/AuthenticationPage';
import { createRefreshRequest } from './apiRequests/userRequests';

export const AppBarRoutes: { [key: string]: string } = {
  create: '/tiernament/create',
  about: '/about',
  imprint: '/imprint',
}

export const UserMenuRoutes: { [key: string]: string } = {
  profile: '/profile',
  settings: '/settings',
  logout: '/logout',
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
        path: 'login',
        element: <AuthenticationPage />,
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

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

createRefreshRequest()

export default function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: '#2bbdc5',
          },
          secondary: {
            main: '#ab47bc',
          },
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}