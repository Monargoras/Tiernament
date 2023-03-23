import React from 'react';
import {
  AppBar, Toolbar, Box, Menu, MenuItem, Container, IconButton, Typography, Button, Tooltip, Avatar, useTheme
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';

import { AppBarRoutes } from '../App';
import LanguageSelector from '../components/general/LanguageSelector';
import ThemeModeToggle from '../components/general/ThemeModeToggle';
import { useAppSelector } from '../redux/hooks';
import { createLogoutUserRequest } from '../apiRequests/userRequests';
import { backendIP } from '../apiRequests/requestGenerator';


export default function RootPage() {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const authState = useAppSelector(state => state.auth)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleNavigate = (destination: string) => {
    navigate(`${AppBarRoutes[destination]}`)
    handleCloseNavMenu()
  }

  const handleSettings = () => {
    navigate('/settings')
    handleCloseUserMenu()
  }

  const handleProfile = () => {
    if(authState.user) {
      navigate(`/profile/${authState.user.name}`)
    }
    handleCloseUserMenu()
  }

  const handleLogout = () => {
    createLogoutUserRequest()
    handleCloseUserMenu()
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <AppBar position={'static'} enableColorOnDark>
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Box
              component={'img'}
              src={'/tiernamentIcon.png'}
              onClick={() => navigate('/')}
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1,
                height: '40px',
                width: '40px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
              alt={'Tiernament'}
            />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <Box
                component={'img'}
                src={'/tiernamentIcon.png'}
                onClick={() => navigate('/')}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  mr: 1,
                  height: '40px',
                  width: '40px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
                alt={'Tiernament'}
              />
              <IconButton
                size='large'
                aria-label='menu'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {Object.keys(AppBarRoutes).map((page) => (
                  <MenuItem key={page} onClick={() => handleNavigate(page)}>
                    <Typography textAlign='center'>{t(page)}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {Object.keys(AppBarRoutes).map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  sx={{ my: 2, color: theme.palette.text.primary, display: 'block' }}
                >
                  {t(page)}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', flexDirection: 'row' }}>
              <Box sx={{ marginRight: '10px' }}>
                <ThemeModeToggle />
              </Box>
              <Box sx={{ marginRight: '10px' }}>
                <LanguageSelector />
              </Box>
              {
                authState.isAuthenticated && authState.user &&
                <Tooltip title={t('openSettings')}>
                  <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar alt={authState.user.name} src={`${backendIP}/api/image/get/${authState.user.avatarId}`}/>
                  </IconButton>
                </Tooltip>
              }
              {
                !authState.isAuthenticated &&
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ p: 0, color: theme.palette.text.primary, display: 'block' }}
                >
                  {t('login')}
                </Button>
              }
              <Menu
                sx={{ mt: '45px' }}
                id='menu-user'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={'profile'} onClick={() => handleProfile()}>
                  <Typography textAlign='center'>{t('profile')}</Typography>
                </MenuItem>
                <MenuItem key={'settings'} onClick={() => handleSettings()}>
                  <Typography textAlign='center'>{t('settings')}</Typography>
                </MenuItem>
                <MenuItem key={'logout'} onClick={() => handleLogout()}>
                  <Typography textAlign='center'>{t('logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          padding: '10px'
        }}
      >
        <Outlet />
      </Box>
    </>
  )
}