import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernamentById } from '../../apiRequests/tiernamentRequests';
import { TiernamentType } from '../../util/types';
import PlayView from './PlayView';
import {Box, Button, Typography} from '@mui/material';

export async function loader(params: { tiernamentId: string }) {
  const res = await fetchTiernamentById(params.tiernamentId)
  return await res.json()
}

export default function Tiernament() {

  const tiernament = useLoaderData() as TiernamentType

  const [playView, setPlayView] = React.useState(false)

  const handlePlay = () => {
    setPlayView(true)
  }

  return (
    <div>
      <Typography variant={'h5'}>{tiernament.name}</Typography>
      {
        !playView &&
        <>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <Typography variant={'body1'}>Entries:&nbsp;&nbsp;</Typography>
            {
              tiernament.entries.map(entry => {
                return <Typography variant={'body1'}>{entry.name}&nbsp;&nbsp;</Typography>
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
        <PlayView/>
      }
    </div>
  )
}