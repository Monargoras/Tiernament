import React from 'react';
import {MatchUpType, TiernamentRunEntryType} from '../../util/types';
import { alpha, Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import CustomAvatar from '../profile/CustomAvatar';


interface SwissMatchUpProps {
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType,
  entryB: TiernamentRunEntryType | undefined,
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
}

export default function SwissMatchUp(props: SwissMatchUpProps) {

  const theme = useTheme()

  const styles = {
    entryBoxA: {
      padding: '5px',
      backgroundColor: props.matchUp.winner === 'A' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'B' ? alpha(theme.palette.error.main, 0.5) : theme.palette.background.paper,
      cursor: props.matchUp.winner === undefined ? 'pointer' : 'default',
    },
    entryBoxB: {
      padding: '5px',
      backgroundColor: props.matchUp.winner === 'B' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'A' ? alpha(theme.palette.error.main, 0.5) : theme.palette.background.paper,
      cursor: props.matchUp.winner === undefined ? 'pointer' : 'default',
    },
    divider: {
      borderStyle: 'solid',
      borderColor: theme.palette.text.primary,
      borderWidth: '0 0 0 1px'
    },
    alignLeft: {
      paddingLeft: '5px',
      display: 'flex',
      textAlign: 'left',
      justifyContent: 'left',
    },
    alignRight: {
      paddingRight: '5px',
      display: 'flex',
      textAlign: 'right',
      justifyContent: 'right',
    }
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <Box sx={styles.entryBoxA} onClick={() => props.handleMatchUpUpdate(props.matchUp.matchUpId, 'A')}>
          <Grid container spacing={0}>
            <Grid item xs={6} sx={styles.alignRight}>
              <Typography
                fontWeight={props.matchUp.winner === 'A' ? 'bold' : 'normal'}
              >
                {props.entryA.name}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={styles.alignLeft}>
              <CustomAvatar userName={props.entryA.name} imageId={props.entryA.imageId} size={{height: 25, width: 25}} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={6} sx={styles.divider}>
        <Box sx={styles.entryBoxB} onClick={() => props.handleMatchUpUpdate(props.matchUp.matchUpId, 'B')}>
          <Grid container spacing={0}>
            <Grid item xs={6} sx={styles.alignRight}>
              <CustomAvatar userName={props.entryB ? props.entryB.name : '-'} imageId={props.entryB ? props.entryB.imageId : ''} size={{height: 25, width: 25}} />
            </Grid>
            <Grid item xs={6} sx={styles.alignLeft}>
              <Typography
                fontWeight={props.matchUp.winner === 'B' ? 'bold' : 'normal'}
              >
                {props.entryB ? props.entryB.name : 'DEFAULT'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}