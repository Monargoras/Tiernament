import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import SwissMatchUp from './SwissMatchUp';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DEFAULT_ENTRY_NAME } from './PlayView';
import MatchUpModal from './MatchUpModal';


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
      minWidth: '30dvw',
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
  const [showModal, setShowModal] = React.useState(false)
  const [modalMatchUp, setModalMatchUp] = React.useState<MatchUpType | undefined>(undefined)
  const [modalEntryA, setModalEntryA] = React.useState<TiernamentRunEntryType | undefined>(undefined)
  const [modalEntryB, setModalEntryB] = React.useState<TiernamentRunEntryType | undefined>(undefined)

  const setNewModalMatchUp = (matchUp: MatchUpType) => {
    setModalMatchUp(matchUp)
    setModalEntryA(matchUp.entryAId && props.entries[matchUp.entryAId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryAId] : undefined)
    setModalEntryB(matchUp.entryBId && props.entries[matchUp.entryBId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryBId] : undefined)
  }
  const handleOpenModal = (matchUp: MatchUpType) => {
    setNewModalMatchUp(matchUp)
    setShowModal(true)
  }
  const handleCloseModal = () => setShowModal(false)

  React.useEffect(() => {
    let timer: number | undefined
    if(!modalMatchUp || modalMatchUp.winner !== undefined) {
      const matchUp = props.matchUps.filter(matchUp => matchUp.winner === undefined)[0]
      if(matchUp) {
        timer = setTimeout(() => setNewModalMatchUp(matchUp), 500)
      } else {
        setShowModal(false)
      }
    }

    return () => {
      if(timer) {
        clearTimeout(timer)
      }
    }
  }, [props.matchUps])

  const getSwissMatchUps = (matchUps: MatchUpType[]) => {
    return matchUps.map((matchUp, index) => {
      return (
        <>
          <SwissMatchUp
            key={matchUp.matchUpId}
            matchUp={matchUp}
            entryA={matchUp.entryAId && props.entries[matchUp.entryAId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryAId] : undefined}
            entryB={matchUp.entryBId && props.entries[matchUp.entryBId].name !== DEFAULT_ENTRY_NAME ? props.entries[matchUp.entryBId] : undefined}
            handleMatchUpUpdate={props.handleMatchUpUpdate}
            handleOpenModal={handleOpenModal}
          />
          {
            index < matchUps.length - 1 &&
            <Divider/>
          }
        </>
      )
    })
  }

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
                <Tooltip title={t('upperBracketTooltip', {wins: winsUpper, losses: lossesUpper})} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        getSwissMatchUps(upperBracket)
                      }
                    </Box>
                </Tooltip>
            }
            {
              middleBracket.length > 0 &&
                <Tooltip title={t('middleBracketTooltip', {wins: winsMiddle, losses: lossesMiddle})} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        getSwissMatchUps(middleBracket)
                      }
                    </Box>
                </Tooltip>
            }
            {
              lowerBracket.length > 0 &&
                <Tooltip title={t('lowerBracketTooltip', {wins: winsLower, losses: lossesLower})} placement={'top'}>
                    <Box sx={styles.bracketBox}>
                      {
                        getSwissMatchUps(lowerBracket)
                      }
                    </Box>
                </Tooltip>
            }
          </Box>
      }
      {
        modalMatchUp &&
          <MatchUpModal
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              entryA={modalEntryA}
              entryB={modalEntryB}
              matchUp={modalMatchUp}
              handleMatchUpUpdate={props.handleMatchUpUpdate}
          />
      }
    </Box>
  )
}