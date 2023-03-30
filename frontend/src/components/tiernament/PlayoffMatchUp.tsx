import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, Divider, Paper, Typography, useTheme } from '@mui/material';
import CustomAvatar from '../profile/CustomAvatar';

interface PlayoffMatchUpProps {
  id: string,
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType,
  entryB: TiernamentRunEntryType,
}

export default function PlayoffMatchUp(props: PlayoffMatchUpProps) {

  const theme = useTheme()

  const styles = {
    tiernamentPlayoffMatchUp: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      justifyContent: 'center',
      padding: '10px',
      elevation: 4,
      boxShadow: `0px 0px 0px 1px ${theme.palette.text.secondary}`,
    },
  }

  return (
    <Paper id={props.id} sx={styles.tiernamentPlayoffMatchUp}>
      <Box sx={{display: 'flex', flexDirection: 'row', px: '5px', pb: '5px'}}>
        <CustomAvatar userName={props.entryA.name} imageId={props.entryA.imageId} size={{height: 25, width: 25}} />
        <Typography
          color={props.matchUp.winner === 'A' ? theme.palette.tertiary.main :
            props.matchUp.winner === 'B' ? theme.palette.error.light : theme.palette.text.primary}
          fontWeight={props.matchUp.winner === 'A' ? 'bold' : 'normal'}
        >
          {props.entryA.name}
        </Typography>
      </Box>
      <Divider sx={{backgroundColor: props.matchUp.winner ? theme.palette.tertiary.main : theme.palette.text.secondary}}/>
      <Box sx={{display: 'flex', flexDirection: 'row', px: '5px', pt: '5px'}}>
        <CustomAvatar userName={props.entryB.name} imageId={props.entryB.imageId} size={{height: 25, width: 25}} />
        <Typography
          color={props.matchUp.winner === 'B' ? theme.palette.tertiary.main :
            props.matchUp.winner === 'A' ? theme.palette.error.light : theme.palette.text.primary}
          fontWeight={props.matchUp.winner === 'B' ? 'bold' : 'normal'}
        >
          {props.entryB.name}
        </Typography>
      </Box>
    </Paper>
  )
}