import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { generalStyles } from '../../util/styles';
import Xarrow, { xarrowPropsType } from 'react-xarrows';
import MatchUp from './MatchUp';
import { placeholderEntryA, placeholderEntryB, placeholderMatchUpNoWinner, placeholderMatchUpWinner } from '../../util/placeholderData';


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
              <MatchUp id={entry} matchUp={placeholderMatchUpWinner} entryA={placeholderEntryA} entryB={placeholderEntryB} />
            </Box>
          ))
        }
      </Grid>
      <Grid item xs={4} id={'semi-final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        {
          semiFinals.map((entry) => (
            <Box key={entry}>
              <MatchUp id={entry} matchUp={placeholderMatchUpWinner} entryA={placeholderEntryA} entryB={placeholderEntryB} />
            </Box>
          ))
        }
        <Xarrow {...arrowProps} start={quarterFinals[0]} end={semiFinals[0]} />
        <Xarrow {...arrowProps} start={quarterFinals[1]} end={semiFinals[0]} />
        <Xarrow {...arrowProps} start={quarterFinals[2]} end={semiFinals[1]} />
        <Xarrow {...arrowProps} start={quarterFinals[3]} end={semiFinals[1]} />
      </Grid>
      <Grid item xs={4} id={'final-column'} sx={generalStyles.tiernamentPlayoffColumn}>
        <MatchUp id={'final'} matchUp={placeholderMatchUpNoWinner} entryA={placeholderEntryA} entryB={placeholderEntryB} />
        <Xarrow {...arrowProps} start={semiFinals[0]} end={final} />
        <Xarrow {...arrowProps} start={semiFinals[1]} end={final} />
      </Grid>
    </Grid>
  )
}