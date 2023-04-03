import React from 'react';
import PlayOffDiagram from './PlayOffDiagram';
import { Accordion, AccordionDetails, AccordionSummary, Box, styled, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TiernamentRunEntryType, TiernamentRunType, TiernamentType } from '../../util/types';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../redux/hooks';
import TiernamentRound from './TiernamentRound';

const CustomAccordion = styled(Accordion)(() => {
  return {
    '& .MuiAccordionSummary-root:hover, .MuiButtonBase-root:hover': {
      cursor: 'default',
    },
  }
})

function createTiernamentRun (tiernament: TiernamentType, needTwoStages: boolean, userId?: string): TiernamentRunType {
  const newRun: TiernamentRunType = {
    runId: uuidv4(),
    playerId: userId || '',
    tiernamentId: tiernament.tiernamentId,
    date: new Date(),
    entries: tiernament.entries.reduce((map: { [id: string]: TiernamentRunEntryType }, obj) => {
      map[obj.entryId] = {
        entryId: obj.entryId,
        name: obj.name,
        imageId: obj.imageId,
        placementHistory: obj.placementHistory,
        eliminated: false,
        winsStage1: 0,
        winsStage2: needTwoStages ? 0 : undefined,
        lossesStage1: 0,
        lossesStage2: needTwoStages ? 0 : undefined,
      }
      return map
    }, {}),
    matchUpsStage1: [],
    matchUpsStage2: needTwoStages ? [] : undefined,
    matchUpsPlayoffs: [],
    winner: undefined,
  }
  // create array of entry ids
  const entryIds = tiernament.entries.map(entry => entry.entryId)
  // randomly pair up entries
  while (entryIds.length > 0) {
    const randomIndex = Math.floor(Math.random() * entryIds.length)
    const randomEntryId = entryIds.splice(randomIndex, 1)[0]
    const randomIndex2 = Math.floor(Math.random() * entryIds.length)
    const randomEntryId2 = entryIds.splice(randomIndex2, 1)[0]
    newRun.matchUpsStage1.push({
      matchUpId: uuidv4(),
      round: 1,
      bracket: 'middle',
      entryAId: randomEntryId,
      entryBId: randomEntryId2,
      winner: undefined,
    })
  }
  return newRun
}

interface PlayViewProps {
  tiernament: TiernamentType
}

export default function PlayView(props: PlayViewProps) {

  const { t } = useTranslation()
  const authState = useAppSelector(state => state.auth)
  const rounds = [1, 2, 3, 4, 5]
  const needTwoStages = props.tiernament.entries.length > 16

  const [currentRun, setCurrentRun] = React.useState(() =>
    createTiernamentRun(props.tiernament, needTwoStages, authState.user?.userId)
  )
  const [nextRound, setNextRound] = React.useState(2)
  const [stage1Expanded, setStage1Expanded] = React.useState(true)
  const [stage2Expanded, setStage2Expanded] = React.useState(false)

  const handleMatchUpUpdate = (matchUpId: string, newWinner: 'A' | 'B') => {
    let newRun = { ...currentRun }
    let matchUp = newRun.matchUpsStage1.find(mU => mU.matchUpId === matchUpId)
    if (matchUp && matchUp.winner === undefined) {
      matchUp.winner = newWinner
      const winner = newRun.entries[matchUp.winner === 'A' ? matchUp.entryAId : matchUp.entryBId]
      winner.winsStage1++
      const loser = newRun.entries[matchUp.winner === 'B' ? matchUp.entryAId : matchUp.entryBId]
      loser.lossesStage1++
      if (currentRun.matchUpsStage1.filter(mU => mU.winner === undefined).length === 0) {
        // handle next round
        console.log('next round')
      }
      setCurrentRun({ ...currentRun })
    }
  }

  return (
    <Box>
      <Accordion expanded={stage1Expanded} onChange={() => setStage1Expanded((prev) => !prev)}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={'stage1-content'}
          id={'stage1-header'}
        >
          <Typography>{t('stage1')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            rounds.map(round => {
              const matchUps = currentRun.matchUpsStage1.filter(mU => mU.round === round)

              return (
                matchUps.length > 0 &&
                <TiernamentRound key={round} matchUps={matchUps} entries={currentRun.entries} handleMatchUpUpdate={handleMatchUpUpdate} />
              )
            })
          }
        </AccordionDetails>
      </Accordion>
      {
        needTwoStages && currentRun.matchUpsStage2 && currentRun.matchUpsStage2?.length > 0 &&
        <Accordion expanded={stage2Expanded} onChange={() => setStage2Expanded((prev) => !prev)}>
          <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls={'stage2-content'}
            id={'stage2-header'}
          >
            <Typography>{t('stage2')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {
              rounds.map(round => {
                if(currentRun.matchUpsStage2) {
                  const matchUps = currentRun.matchUpsStage2.filter(mU => mU.round === round)

                  return (
                    matchUps.length > 0 &&
                    <TiernamentRound key={round} matchUps={matchUps} entries={currentRun.entries} handleMatchUpUpdate={handleMatchUpUpdate} />
                  )
                }
              })
            }
          </AccordionDetails>
        </Accordion>
      }
      {
        currentRun.matchUpsPlayoffs.length > 0 &&
        <CustomAccordion defaultExpanded expanded={true} onChange={() => {}}>
          <AccordionSummary
            aria-controls={'playoffs-content'}
            id={'playoffs-header'}
          >
            <Typography>{t('playoffs')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PlayOffDiagram/>
          </AccordionDetails>
        </CustomAccordion>
      }
    </Box>
  )
}