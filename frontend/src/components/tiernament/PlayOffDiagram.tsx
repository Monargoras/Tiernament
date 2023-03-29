import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { generalStyles } from '../../util/styles';
import Xarrow from 'react-xarrows';
import { MatchUpType } from '../../util/types';
import MatchUp from './MatchUp';

const placeholderMatchUpWinner: MatchUpType = {
  matchUpId: '1',
  entry1: {
    entryId: '1',
    name: 'Fop',
    imageLink: '',
    placementHistory: [],
  },
  entry2: {
    entryId: '2',
    name: 'Dt',
    imageLink: '',
    placementHistory: [],
  },
  winnerId: '1',
}

const placeholderMatchUpNoWinner: MatchUpType = {
  matchUpId: '1',
  entry1: {
    entryId: '1',
    name: 'Fop',
    imageLink: '',
    placementHistory: [],
  },
  entry2: {
    entryId: '2',
    name: 'Dt',
    imageLink: '',
    placementHistory: [],
  },
  winnerId: '',
}

export default function PlayOffDiagram() {

  const theme = useTheme()

  const quarterFinals = ['quarter1', 'quarter2', 'quarter3', 'quarter4']
  const semiFinals = ['semi1', 'semi2']

  return (
    <Grid container>
      <Grid item xs={4} id={'quarter-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          quarterFinals.map((entry) => (
            <Box key={entry}>
              <Box id={entry}
                   sx={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center',
                     border: 'solid', borderColor: '#ff0000', borderWidth: '2px', width: '100px', height: '50px'}}
              >
                <Typography>{entry}</Typography>
              </Box>
            </Box>
          ))
        }
      </Grid>
      <Grid item xs={4} id={'semi-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          semiFinals.map((entry) => (
            <Box key={entry}>
              <MatchUp id={entry} matchUp={placeholderMatchUpWinner} />
            </Box>
          ))
        }
        <Xarrow start={'quarter1'} end={'semi1'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
        <Xarrow start={'quarter2'} end={'semi1'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
        <Xarrow start={'quarter3'} end={'semi2'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
        <Xarrow start={'quarter4'} end={'semi2'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
      </Grid>
      <Grid item xs={4} id={'final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        <MatchUp id={'final'} matchUp={placeholderMatchUpNoWinner} />
        <Xarrow start={'semi1'} end={'final'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
        <Xarrow start={'semi2'} end={'final'} color={theme.palette.tertiary.main} showHead={false} showTail={false} strokeWidth={2} path={'grid'} />
      </Grid>
    </Grid>
  )
}