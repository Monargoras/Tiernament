import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { Box } from '@mui/material';
import Editor from '../components/tiernament/Editor';

export default function CreatePage() {

  const navigate = useNavigate()
  const authState = useAppSelector(state => state.auth)

  React.useEffect(() => {
    if (!authState.user) {
      navigate('/login', { state: { from: '/tiernament/create' } })
    }
  }, [])

  return (
    <Box>
      <Editor />
    </Box>
  )
}