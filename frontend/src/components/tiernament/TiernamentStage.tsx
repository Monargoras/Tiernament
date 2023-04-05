import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import SwissMatchUp from './SwissMatchUp';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DEFAULT_ENTRY_NAME } from './PlayView';


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

  const round = lowerBracket.length > 0 ? lowerBracket[0].round - 1 : middleBracket.length > 0 ? middleBracket[0].round - 1 : upperBracket[0].round - 1

  const lowerMatchUp = lowerBracket.length > 0 ? props.entries[lowerBracket[0].entryAId] : undefined
  const winsLower = lowerMatchUp && (lowerBracket[0].stage === 'stage2' ?
    lowerMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'w').length :
    lowerMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'w').length)
  const lossesLower = lowerMatchUp && (lowerBracket[0].stage === 'stage2' ?
    lowerMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'l').length :
    lowerMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'l').length)

  const middleMatchUp = middleBracket.length > 0 ? props.entries[middleBracket[0].entryAId] : undefined
  const winsMiddle = middleMatchUp && (middleBracket[0].stage === 'stage2' ?
    middleMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'w').length :
    middleMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'w').length)
  const lossesMiddle = middleMatchUp && (middleBracket[0].stage === 'stage2' ?
    middleMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'l').length :
    middleMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'l').length)

  const upperMatchUp = upperBracket.length > 0 ? props.entries[upperBracket[0].entryAId] : undefined
  const winsUpper = upperMatchUp && (upperBracket[0].stage === 'stage2' ?
    upperMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'w').length :
    upperMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'w').length)
  const lossesUpper = upperMatchUp && (upperBracket[0].stage === 'stage2' ?
    upperMatchUp.matchHistoryStage2.slice(0, round).filter(res => res === 'l').length :
    upperMatchUp.matchHistoryStage1.slice(0, round).filter(res => res === 'l').length)

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
                <Tooltip title={`${t('wins')}: ${winsUpper} | ${t('losses')}: ${lossesUpper}`} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        upperBracket.map(matchUp => (
                          <SwissMatchUp
                            key={matchUp.matchUpId}
                            matchUp={matchUp}
                            entryA={matchUp.entryAId && props.entries[matchUp.entryAId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryAId] : undefined}
                            entryB={matchUp.entryBId && props.entries[matchUp.entryBId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryBId] : undefined}
                            handleMatchUpUpdate={props.handleMatchUpUpdate}
                          />
                        ))
                      }
                    </Box>
                </Tooltip>
            }
            {
              middleBracket.length > 0 &&
                <Tooltip title={`${t('wins')}: ${winsMiddle} | ${t('losses')}: ${lossesMiddle}`} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        middleBracket.map(matchUp => (
                          <SwissMatchUp
                            key={matchUp.matchUpId}
                            matchUp={matchUp}
                            entryA={matchUp.entryAId && props.entries[matchUp.entryAId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryAId] : undefined}
                            entryB={matchUp.entryBId && props.entries[matchUp.entryBId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryBId] : undefined}
                            handleMatchUpUpdate={props.handleMatchUpUpdate}
                          />
                        ))
                      }
                    </Box>
                </Tooltip>
            }
            {
              lowerBracket.length > 0 &&
                <Tooltip title={`${t('wins')}: ${winsLower} | ${t('losses')}: ${lossesLower}`} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        lowerBracket.map(matchUp => (
                          <SwissMatchUp
                            key={matchUp.matchUpId}
                            matchUp={matchUp}
                            entryA={matchUp.entryAId && props.entries[matchUp.entryAId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryAId] : undefined}
                            entryB={matchUp.entryBId && props.entries[matchUp.entryBId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryBId] : undefined}
                            handleMatchUpUpdate={props.handleMatchUpUpdate}
                          />
                        ))
                      }
                    </Box>
                </Tooltip>
            }
          </Box>
      }
    </Box>
  )
}