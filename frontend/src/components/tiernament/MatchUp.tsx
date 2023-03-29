import React from 'react';
import { MatchUpType } from '../../util/types';
import { generalStyles } from '../../util/styles';
import { Divider, Paper, Typography, useTheme } from '@mui/material';

interface MatchUpProps {
  id: string,
  matchUp: MatchUpType,
}

export default function MatchUp(props: MatchUpProps) {

  const theme = useTheme()

  return (
    <Paper id={props.id} sx={generalStyles.tiernamentMatchUp}>
      <Typography
        color={props.matchUp.winnerId === props.matchUp.entry1.entryId ? theme.palette.tertiary.main :
          props.matchUp.winnerId !== '' ? theme.palette.error.light : theme.palette.text.primary}
        fontWeight={props.matchUp.winnerId === props.matchUp.entry1.entryId ? 'bold' : 'normal'}
      >
        {props.matchUp.entry1.name}
      </Typography>
      <Divider sx={{backgroundColor: props.matchUp.winnerId !== '' ? theme.palette.tertiary.main : theme.palette.text.secondary}}/>
      <Typography
        color={props.matchUp.winnerId === props.matchUp.entry2.entryId ? theme.palette.tertiary.main :
          props.matchUp.winnerId !== '' ? theme.palette.error.light : theme.palette.text.primary}
        fontWeight={props.matchUp.winnerId === props.matchUp.entry2.entryId ? 'bold' : 'normal'}
      >
        {props.matchUp.entry2.name}
      </Typography>
    </Paper>
  )
}