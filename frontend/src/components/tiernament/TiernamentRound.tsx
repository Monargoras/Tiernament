import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, Typography, useTheme } from '@mui/material';
import SwissMatchUp from './SwissMatchUp';


interface TiernamentRoundProps {
  matchUps: MatchUpType[],
  entries: { [id: string]: TiernamentRunEntryType },
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
}

export default function TiernamentRound(props: TiernamentRoundProps) {

  const theme = useTheme()

  const styles = {
    bracketBox: {
      minWidth: '25dvw',
      borderStyle: 'solid',
      borderColor: theme.palette.text.primary,
      borderWidth: '1px 1px 1px 1px',
    }
  }

  const lowerBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'lower')
  const middleBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'middle')
  const upperBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'upper')

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
      <Typography variant={'h6'} color={theme.palette.primary.main} sx={{mb: '10px'}}>
        Round {props.matchUps[0].round}
      </Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
        {
          lowerBracket.length > 0 &&
          <Box sx={styles.bracketBox}>
            {
              lowerBracket.map(matchUp => (
                <SwissMatchUp
                  key={matchUp.matchUpId}
                  matchUp={matchUp}
                  entryA={props.entries[matchUp.entryAId]}
                  entryB={props.entries[matchUp.entryBId]}
                  handleMatchUpUpdate={props.handleMatchUpUpdate}
                />
              ))
            }
          </Box>
        }
        {
          middleBracket.length > 0 &&
          <Box sx={styles.bracketBox}>
            {
              middleBracket.map(matchUp => (
                <SwissMatchUp
                  key={matchUp.matchUpId}
                  matchUp={matchUp}
                  entryA={props.entries[matchUp.entryAId]}
                  entryB={props.entries[matchUp.entryBId]}
                  handleMatchUpUpdate={props.handleMatchUpUpdate}
                />
              ))
            }
          </Box>
        }
        {
          upperBracket.length > 0 &&
          <Box sx={styles.bracketBox}>
            {
              upperBracket.map(matchUp => (
                <SwissMatchUp
                  key={matchUp.matchUpId}
                  matchUp={matchUp}
                  entryA={props.entries[matchUp.entryAId]}
                  entryB={props.entries[matchUp.entryBId]}
                  handleMatchUpUpdate={props.handleMatchUpUpdate}
                />
              ))
            }
          </Box>
        }
      </Box>
    </Box>
  )
}