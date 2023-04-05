import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, Divider, Paper, Typography, useTheme } from '@mui/material';
import CustomAvatar from '../profile/CustomAvatar';

interface PlayoffMatchUpProps {
  id: string,
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType | undefined,
  entryB: TiernamentRunEntryType | undefined,
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
}

export default function PlayoffMatchUp(props: PlayoffMatchUpProps) {

  const theme = useTheme()

  const DUMMY_NAME = 'TBD'

  const styles = {
    tiernamentPlayoffMatchUp: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      justifyContent: 'center',
      padding: '10px',
      elevation: 4,
      boxShadow: `0px 0px 0px 1px ${theme.palette.text.secondary}`,
      cursor: props.matchUp.winner === undefined && props.matchUp.entryBId ? 'pointer' : 'default',
    },
  }

  const handleMatchUpUpdate = (winner: 'A' | 'B') => {
    if (props.matchUp.winner === undefined) {
      props.handleMatchUpUpdate(props.matchUp.matchUpId, winner)
    }
  }

  return (
    <Paper id={props.id} sx={styles.tiernamentPlayoffMatchUp}>
      <Box sx={{display: 'flex', flexDirection: 'row', px: '5px', pb: '5px'}} onClick={() => handleMatchUpUpdate('A')}>
        <CustomAvatar userName={props.entryA ? props.entryA.name : DUMMY_NAME} imageId={props.entryA ? props.entryA.imageId : ''} size={{height: 25, width: 25}} />
        <div style={{width: '10px'}} />
        <Typography
          color={props.matchUp.winner === 'A' ? theme.palette.tertiary.main :
            props.matchUp.winner === 'B' ? theme.palette.error.light : theme.palette.text.primary}
          fontWeight={props.matchUp.winner === 'A' ? 'bold' : 'normal'}
        >
          {props.entryA ? props.entryA.name : DUMMY_NAME}
        </Typography>
      </Box>
      <Divider sx={{backgroundColor: props.matchUp.winner ? theme.palette.tertiary.main : theme.palette.text.secondary}}/>
      <Box sx={{display: 'flex', flexDirection: 'row', px: '5px', pt: '5px'}} onClick={() => handleMatchUpUpdate('B')}>
        <CustomAvatar userName={props.entryB ? props.entryB.name : DUMMY_NAME} imageId={props.entryB ? props.entryB.imageId : ''} size={{height: 25, width: 25}} />
        <div style={{width: '10px'}} />
        <Typography
          color={props.matchUp.winner === 'B' ? theme.palette.tertiary.main :
            props.matchUp.winner === 'A' ? theme.palette.error.light : theme.palette.text.primary}
          fontWeight={props.matchUp.winner === 'B' ? 'bold' : 'normal'}
        >
          {props.entryB ? props.entryB.name : DUMMY_NAME}
        </Typography>
      </Box>
    </Paper>
  )
}