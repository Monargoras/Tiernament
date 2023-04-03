import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import SwissMatchUp from './SwissMatchUp';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


interface TiernamentStageProps {
  matchUps: MatchUpType[],
  entries: { [id: string]: TiernamentRunEntryType },
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
  stage: 1 | 2,
}

export default function TiernamentStage(props: TiernamentStageProps) {

  const theme = useTheme()
  const { t } = useTranslation()

  const styles = {
    bracketBox: {
      minWidth: '25dvw',
      borderStyle: 'solid',
      borderColor: theme.palette.text.primary,
      borderWidth: '1px 1px 1px 1px',
      marginY: 'auto',
    }
  }

  const lowerBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'lower')
  const middleBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'middle')
  const upperBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'upper')

  const [expanded, setExpanded] = React.useState(true)

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '10px', mt: props.matchUps[0].round > 1 ? '20px' : 0}}>
        <Typography variant={'h6'} color={theme.palette.primary.main}>
          {t('round')} {props.matchUps[0].round}
        </Typography>
        <IconButton onClick={() => setExpanded((prev) => !prev)} color={'primary'}>
          {expanded ? <ExpandLess/> : <ExpandMore/>}
        </IconButton>
      </Box>
      {
        expanded &&
          <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
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
          </Box>
      }
    </Box>
  )
}