import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { generalStyles } from '../../util/styles';
import Xarrow, {xarrowPropsType} from 'react-xarrows';
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
  const final = 'final'
  const arrowProps: xarrowPropsType = {
    start: '',
    end: '',
    color: theme.palette.tertiary.main,
    showHead: false,
    showTail: false,
    strokeWidth: 2,
    path: 'grid',
  }

  return (
    <Grid container>
      <Grid item xs={4} id={'quarter-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          quarterFinals.map((entry) => (
            <Box key={entry}>
              <MatchUp id={entry} matchUp={placeholderMatchUpWinner} />
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
        <Xarrow {...arrowProps} start={quarterFinals[0]} end={semiFinals[0]} />
        <Xarrow {...arrowProps} start={quarterFinals[1]} end={semiFinals[0]} />
        <Xarrow {...arrowProps} start={quarterFinals[2]} end={semiFinals[1]} />
        <Xarrow {...arrowProps} start={quarterFinals[3]} end={semiFinals[1]} />
      </Grid>
      <Grid item xs={4} id={'final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        <MatchUp id={'final'} matchUp={placeholderMatchUpNoWinner} />
        <Xarrow {...arrowProps} start={semiFinals[0]} end={final} />
        <Xarrow {...arrowProps} start={semiFinals[1]} end={final} />
      </Grid>
    </Grid>
  )
}