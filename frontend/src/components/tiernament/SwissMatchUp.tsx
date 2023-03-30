import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { generalStyles } from '../../util/styles';
import { alpha, Box, Divider, Paper, Typography, useTheme } from '@mui/material';
import CustomAvatar from '../profile/CustomAvatar';


interface SwissMatchUpProps {
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType,
  entryB: TiernamentRunEntryType | undefined,
}

export default function SwissMatchUp(props: SwissMatchUpProps) {

  const theme = useTheme()

  const swissMatchUpStyles = {
    entryBoxA: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.matchUp.winner === 'A' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'B' ? alpha(theme.palette.error.light, 0.5) : theme.palette.background.paper,
      padding: '5px',
    },
    entryBoxB: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.matchUp.winner === 'B' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'A' ? alpha(theme.palette.error.light, 0.5) : theme.palette.background.paper,
      padding: '5px',
    },
    image: {
      maxHeight: '25px',
      maxWidth: '25px',
    },
  }

  return (
    <Paper sx={generalStyles.tiernamentSwissMatchUp}>
      <Box sx={swissMatchUpStyles.entryBoxA}>
        <Typography
          fontWeight={props.matchUp.winner === 'A' ? 'bold' : 'normal'}
        >
          {props.entryA.name}
        </Typography>
        <CustomAvatar userName={props.entryA.name} imageId={props.entryA.imageId} size={{height: 25, width: 25}} />
      </Box>
      <Divider orientation={'vertical'} flexItem />
      <Box sx={swissMatchUpStyles.entryBoxB}>
        <CustomAvatar userName={props.entryB ? props.entryB.name : '-'} imageId={props.entryB ? props.entryB.imageId : ''} size={{height: 25, width: 25}} />
        <Typography
          fontWeight={props.matchUp.winner === 'B' ? 'bold' : 'normal'}
        >
          {props.entryB ? props.entryB.name : 'DEFAULT'}
        </Typography>
      </Box>
    </Paper>
  )
}