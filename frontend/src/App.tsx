import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, CssBaseline, PaletteColor, ThemeProvider } from '@mui/material';
import ErrorPage from './pages/ErrorPage';
import TiernamentPage from './pages/TiernamentPage';
import HomePage from './pages/HomePage';
import Tiernament from './components/tiernament/Tiernament';
import { loader as tiernamentLoader } from './pages/TiernamentPage';
import { loader as tiernamentIdLoader } from './components/tiernament/Tiernament';
import RootPage from './pages/RootPage';
import AuthenticationPage from './pages/AuthenticationPage';
import { createRefreshUserRequest } from './apiRequests/userRequests';
import ProfilePage from './pages/ProfilePage';
import { loader as profileLoader } from './pages/ProfilePage';
import LoadingPage from './pages/LoadingPage';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor;
  }
  interface PaletteOptions {
    tertiary: PaletteColor;
  }
}

export const AppBarRoutes: { [key: string]: string } = {
  create: '/tiernament/create',
  about: '/about',
  imprint: '/imprint',
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
        path: 'profile/:username',
        element: <ProfilePage />,
        loader: (args) => profileLoader(args.params as { username: string }),
      },
      {
        path: 'settings',
        element: <p>Settings</p>,
      },
      {
        path: 'imprint',
        element: <p>Imprint</p>,
      }
    ]
  }
])

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

createRefreshUserRequest()

const initialMode = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'

export default function App() {
  const [mode, setMode] = React.useState<'light' | 'dark'>(initialMode)
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          localStorage.setItem('theme', prevMode === 'light' ? 'dark' : 'light')
          return prevMode === 'light' ? 'dark' : 'light'
        })
      },
    }),
    [],
  )

  const { palette } = createTheme()

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
          tertiary: palette.augmentColor({
            color: {
              main: '#fcd54a',
            }
          }),
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<LoadingPage />}>
          <CssBaseline />
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}