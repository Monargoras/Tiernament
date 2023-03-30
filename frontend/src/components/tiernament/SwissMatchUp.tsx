import React from 'react';
import {MatchUpType, TiernamentRunEntryType} from '../../util/types';
import { alpha, Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import CustomAvatar from '../profile/CustomAvatar';


interface SwissMatchUpProps {
  matchUp: MatchUpType,
  entryA: TiernamentRunEntryType,
  entryB: TiernamentRunEntryType | undefined,
}

export default function SwissMatchUp(props: SwissMatchUpProps) {

  const theme = useTheme()

  const styles = {
    tiernamentSwissMatchUp: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      boxShadow: `0px 0px 0px 1px ${theme.palette.text.primary}`,
    },
    entryBoxA: {
      padding: '5px',
      backgroundColor: props.matchUp.winner === 'A' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'B' ? alpha(theme.palette.error.light, 0.5) : theme.palette.background.paper,
    },
    entryBoxB: {
      padding: '5px',
      backgroundColor: props.matchUp.winner === 'B' ? alpha(theme.palette.tertiary.main, 0.5) :
        props.matchUp.winner === 'A' ? alpha(theme.palette.error.light, 0.5) : theme.palette.background.paper,
    },
    divider: {
      borderStyle: 'solid',
      borderColor: theme.palette.text.primary,
      borderWidth: '0 0 0 1px'
    },
    alignLeft: {
      display: 'flex',
      textAlign: 'left',
      justifyContent: 'left',
    },
    alignRight: {
      display: 'flex',
      textAlign: 'right',
      justifyContent: 'right',
    }
  }

  return (
    <Paper sx={styles.tiernamentSwissMatchUp}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Box sx={styles.entryBoxA}>
            <Grid container spacing={2}>
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
          <Box sx={styles.entryBoxB}>
            <Grid container spacing={2}>
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
    </Paper>
  )
}