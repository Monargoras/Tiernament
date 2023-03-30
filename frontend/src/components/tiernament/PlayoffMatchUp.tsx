import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { generalStyles } from '../../util/styles';
import { Divider, Paper, Typography, useTheme } from '@mui/material';

interface PlayoffMatchUpProps {
  id: string,
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType,
  entryB: TiernamentRunEntryType,
}

export default function PlayoffMatchUp(props: PlayoffMatchUpProps) {

  const theme = useTheme()

  return (
    <Paper id={props.id} sx={generalStyles.tiernamentPlayoffMatchUp}>
      <Typography
        color={props.matchUp.winner === 'A' ? theme.palette.tertiary.main :
          props.matchUp.winner === 'B' ? theme.palette.error.light : theme.palette.text.primary}
        fontWeight={props.matchUp.winner === 'A' ? 'bold' : 'normal'}
      >
        {props.entryA.name}
      </Typography>
      <Divider sx={{backgroundColor: props.matchUp.winner ? theme.palette.tertiary.main : theme.palette.text.secondary}}/>
      <Typography
        color={props.matchUp.winner === 'B' ? theme.palette.tertiary.main :
          props.matchUp.winner === 'A' ? theme.palette.error.light : theme.palette.text.primary}
        fontWeight={props.matchUp.winner === 'B' ? 'bold' : 'normal'}
      >
        {props.entryB.name}
      </Typography>
    </Paper>
  )
}