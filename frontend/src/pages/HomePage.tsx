import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';


export default function HomePage() {

  const navigate = useNavigate()

  return (
    <div>
      <Typography variant={'h2'}>
        Home Page
      </Typography>
      <Button variant={'contained'} onClick={() => navigate('/tiernament')}>
        Tiernament
      </Button>
    </div>
  )
}