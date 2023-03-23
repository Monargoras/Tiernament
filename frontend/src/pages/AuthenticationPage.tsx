import React from 'react';
import { Box } from '@mui/material';
import LoginRegisterPanel from '../components/general/LoginRegisterPanel';
import { generalStyles } from '../util/styles';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';


export default function AuthenticationPage() {

  const authState = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  React.useEffect(() => {
    if(authState.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [authState.isAuthenticated, navigate])

  return (
    <Box sx={generalStyles.backgroundContainer}>
      <LoginRegisterPanel />
    </Box>
  )
}