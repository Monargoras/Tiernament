import React from 'react';
import { Box } from '@mui/material';
import LoginRegisterPanel from '../components/general/LoginRegisterPanel';
import { generalStyles } from '../util/styles';
import { useAppSelector } from '../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';


export default function AuthenticationPage() {

  const authState = useAppSelector(state => state.auth)
  const navigate = useNavigate()
  const { state } = useLocation()

  React.useEffect(() => {
    if(authState.isAuthenticated) {
      navigate(state.from || '/', { replace: true })
    }
  }, [authState.isAuthenticated, navigate])

  return (
    <Box sx={generalStyles.backgroundContainer}>
      <LoginRegisterPanel />
    </Box>
  )
}