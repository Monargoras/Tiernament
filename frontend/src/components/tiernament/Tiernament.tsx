import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernamentById } from '../../apiRequests/tiernamentRequests';
import { TiernamentType } from '../../util/types';
import PlayView from './PlayView';
import { Box, Button, Paper, Typography } from '@mui/material';
import CustomAvatar from '../general/CustomAvatar';

export async function loader(params: { tiernamentId: string }) {
  const res = await fetchTiernamentById(params.tiernamentId)
  return await res.json()
}

export default function Tiernament() {

  const styles = {
    entryBox: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'primary.main',
      borderRadius: '5px',
      p: '5px',
      mr: '5px',
      mb: '5px',
    },
  }

  const tiernament = useLoaderData() as TiernamentType

  const [playView, setPlayView] = React.useState(false)

  const handlePlay = () => {
    setPlayView(true)
  }

  return (
    <Box>
      <Typography variant={'h5'}>{tiernament.name}</Typography>
      {
        !playView &&
        <>
          <Typography variant={'body1'}>{tiernament.description}</Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            {
              tiernament.entries.map((entry, index) => {
                return (
                  <Paper key={index} sx={styles.entryBox}>
                    <Box sx={{m: '5px', mr: '10px'}}>
                      <CustomAvatar userName={entry.name} imageId={entry.imageId} size={{width: 25, height: 25}} />
                    </Box>
                    <Typography variant={'body1'}>{entry.name}</Typography>
                  </Paper>
                )
              })
            }
          </Box>
          <Button variant={'contained'} onClick={handlePlay}>
            Play
          </Button>
        </>
      }
      {
        playView &&
        <PlayView tiernament={tiernament} />
      }
    </Box>
  )
}