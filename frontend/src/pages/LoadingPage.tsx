import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { generalStyles } from '../util/styles';

export default function LoadingPage() {

  return (
    <Box sx={{...generalStyles.centerEverything, paddingTop: '150px'}}>
      <Typography variant={'h5'} sx={{padding: '10px'}}>
        Loading site...
      </Typography>
      <LinearProgress color={'primary'} sx={{width: '25%', margin: 'auto'}} />
    </Box>
  )
}