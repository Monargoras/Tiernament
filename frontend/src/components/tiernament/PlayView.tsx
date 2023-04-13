import React from 'react';
import PlayOffDiagram from './PlayOffDiagram';
import { Accordion, AccordionDetails, AccordionSummary, Box, styled, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MatchUpType, TiernamentRunEntryType, TiernamentRunType, TiernamentType } from '../../util/types';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../redux/hooks';
import TiernamentStage from './TiernamentStage';

const CustomAccordion = styled(Accordion)(() => {
  return {
    '& .MuiAccordionSummary-root:hover, .MuiButtonBase-root:hover': {
      cursor: 'default',
    },
  }
})

export const DEFAULT_ENTRY_NAME = '-TiernamentEntry-'

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
        matchHistoryStage1: [],
        matchHistoryStage2: [],
        eliminated: false,
        advanced: false,
        winsStage1: 0,
        winsStage2: 0,
        lossesStage1: 0,
        lossesStage2: 0,
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
  // fill entryIds until length is a power of 2
  while (entryIds.length < 16 || entryIds.length > 16 && entryIds.length < 32) {
    const defaultId = uuidv4()
    entryIds.push(defaultId)
    newRun.entries[defaultId] = {
      entryId: defaultId,
      name: DEFAULT_ENTRY_NAME,
      imageId: '',
      matchHistoryStage1: [],
      matchHistoryStage2: [],
      eliminated: false,
      advanced: false,
      winsStage1: 0,
      winsStage2: 0,
      lossesStage1: 0,
      lossesStage2: 0,
    }
  }
  newRun.matchUpsStage1.push(...generateMatchUps(entryIds, 1, 'middle', newRun.entries, 'stage1'))
  return newRun
}

function getNextMatchUpEntryId(nonDummyEntryIds: string[], dummyEntryIds: string[], preferDummy: boolean) {
  if (preferDummy) {
    if (dummyEntryIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * dummyEntryIds.length)
      return dummyEntryIds.splice(randomIndex, 1)[0]
    } else {
      const randomIndex = Math.floor(Math.random() * nonDummyEntryIds.length)
      return nonDummyEntryIds.splice(randomIndex, 1)[0]
    }
  } else {
    if (nonDummyEntryIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * nonDummyEntryIds.length)
      return nonDummyEntryIds.splice(randomIndex, 1)[0]
    } else {
      const randomIndex = Math.floor(Math.random() * dummyEntryIds.length)
      return dummyEntryIds.splice(randomIndex, 1)[0]
    }
  }
}

function generateMatchUps(ids: string[], round: number, bracket: 'lower' | 'middle' | 'upper', entries: { [id: string]: TiernamentRunEntryType }, stage: 'stage1' | 'stage2'): MatchUpType[] {
  const entryIds = [...ids]
  const matchUps: MatchUpType[] = []
  const nonDummyEntries = entryIds.filter(id => entries[id].name !== DEFAULT_ENTRY_NAME)
  const dummyEntries = entryIds.filter(id => entries[id].name === DEFAULT_ENTRY_NAME)
  // randomly pair up entries
  while (entryIds.length > 0) {
    const entryA = getNextMatchUpEntryId(nonDummyEntries, dummyEntries, false)
    entryIds.splice(entryIds.indexOf(entryA), 1)
    const entryB = getNextMatchUpEntryId(nonDummyEntries, dummyEntries, true)
    entryIds.splice(entryIds.indexOf(entryB), 1)

    matchUps.push({
      matchUpId: uuidv4(),
      stage: stage,
      round: round,
      bracket: bracket,
      entryAId: entryA,
      entryBId: entryB,
      winner: undefined,
    })
  }
  return matchUps.reverse()
}

interface PlayViewProps {
  tiernament: TiernamentType
}

export default function PlayView(props: PlayViewProps) {

  const { t } = useTranslation()
  const authState = useAppSelector(state => state.auth)
  const rounds = [1, 2, 3, 4, 5]
  const needTwoStages = props.tiernament.entries.length > 16

  const curRoundRef = React.useRef<HTMLDivElement>(null)

  const [currentRun, setCurrentRun] = React.useState(() =>
    createTiernamentRun(props.tiernament, needTwoStages, authState.user?.userId)
  )
  const [nextRound, setNextRound] = React.useState(2)
  const [stage1Expanded, setStage1Expanded] = React.useState(true)
  const [stage2Expanded, setStage2Expanded] = React.useState(false)
  const [scrollToBottom, setScrollToBottom] = React.useState(false)

  React.useEffect(() => {
    if(scrollToBottom) {
      scrollToBottomRound()
    }
    setScrollToBottom(false)
  }, [scrollToBottom])

  const scrollToBottomRound = () => {
    if(curRoundRef.current) curRoundRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const handleRoundEnd = (newRun: TiernamentRunType, stage: 1 | 2): MatchUpType[] => {
    const newMatchUps: MatchUpType[] = []
    const entries = Object.values(newRun.entries).filter(entry => !entry.eliminated && !entry.advanced)
    const upperBracketEntries = entries.filter(entry => {
      if(stage === 2) return entry.winsStage2 > entry.lossesStage2
      return entry.winsStage1 > entry.lossesStage1
    })
    const middleBracketEntries = entries.filter(entry => {
      if(stage === 2) return entry.winsStage2 === entry.lossesStage2
      return entry.winsStage1 === entry.lossesStage1
    })
    const lowerBracketEntries = entries.filter(entry => {
      if(stage === 2) return entry.winsStage2 < entry.lossesStage2
      return entry.winsStage1 < entry.lossesStage1
    })
    newMatchUps.push(...generateMatchUps(upperBracketEntries.map(entry => entry.entryId), nextRound, 'upper', newRun.entries, stage === 1 ? 'stage1' : 'stage2'))
    newMatchUps.push(...generateMatchUps(middleBracketEntries.map(entry => entry.entryId), nextRound, 'middle', newRun.entries, stage === 1 ? 'stage1' : 'stage2'))
    newMatchUps.push(...generateMatchUps(lowerBracketEntries.map(entry => entry.entryId), nextRound, 'lower', newRun.entries, stage === 1 ? 'stage1' : 'stage2'))
    return newMatchUps
  }

  const handlePlayOffSetup = (newRun: TiernamentRunType) => {
    // order last 8 by total wins minus total losses
    const last8 = Object.values(newRun.entries).filter(entry => !entry.eliminated)
    last8.sort((a, b) => {
      return (a.winsStage2 - a.lossesStage2) - (b.winsStage2 - b.lossesStage2)
    })
    // create matchUps, pair 1st and 8th, 2nd and 7th, etc.
    const newMatchUps: MatchUpType[] = []
    for(let i = 0; i < 4; i++) {
      const matchUp: MatchUpType = {
        matchUpId: uuidv4(),
        stage: 'playoffs',
        round: 6,
        bracket: 'playoffs',
        entryAId: last8[i].entryId,
        entryBId: last8[7-i].entryId,
        winner: undefined
      }
      newMatchUps.push(matchUp)
    }
    setNextRound(7)
    return newMatchUps
  }

  const handleMatchUpUpdateStage1 = (matchUpId: string, newWinner: 'A' | 'B') => {
    let newRun = { ...currentRun }
    let matchUp = newRun.matchUpsStage1.find(mU => mU.matchUpId === matchUpId)
    if(matchUp && matchUp.winner === undefined) {
      matchUp.winner = newWinner
      const winner = newRun.entries[matchUp.winner === 'A' ? matchUp.entryAId : matchUp.entryBId ? matchUp.entryBId : '']
      winner.winsStage1++
      winner.matchHistoryStage1.push('w')
      if(winner.winsStage1 >= 3) {
        winner.advanced = true
      }
      const loser = newRun.entries[matchUp.winner === 'B' ? matchUp.entryAId : matchUp.entryBId]
      loser.lossesStage1++
      loser.matchHistoryStage1.push('l')
      if(loser.lossesStage1 >= 3) {
        loser.eliminated = true
      }
      if(newRun.matchUpsStage1.filter(mU => mU.winner === undefined).length === 0 && nextRound <= 5) {
        const newMatchUps = handleRoundEnd(newRun, 1)
        newRun.matchUpsStage1.push(...newMatchUps)
        setNextRound((prev) => prev + 1)
        setScrollToBottom(true)
      } else if(newRun.matchUpsStage1.filter(mU => mU.winner === undefined).length === 0 && nextRound > 5 && needTwoStages) {
        // generate new match ups for stage2, reset advanced attribute
        Object.values(newRun.entries).forEach(entry => entry.advanced = false)
        const newMatchUps = generateMatchUps(
          Object.values(newRun.entries)
            .filter(entry => !entry.eliminated)
            .map(entry => entry.entryId),
          1,
          'middle',
          newRun.entries,
          'stage2'
        )
        if(newRun.matchUpsStage2) {
          newRun.matchUpsStage2.push(...newMatchUps)
        }
        setNextRound(2)
        setStage1Expanded(false)
        setStage2Expanded(true)
      } else if(newRun.matchUpsStage1.filter(mU => mU.winner === undefined).length === 0 && nextRound > 5) {
        setStage1Expanded(false)
        const newMatchUps = handlePlayOffSetup(newRun)
        newRun.matchUpsPlayoffs.push(...newMatchUps)
        setScrollToBottom(true)
      }
      setCurrentRun({ ...newRun })
    }
  }

  const handleMatchUpUpdateStage2 = (matchUpId: string, newWinner: 'A' | 'B') => {
    let newRun = {...currentRun}
    if(newRun.matchUpsStage2) {
      let matchUp = newRun.matchUpsStage2.find(mU => mU.matchUpId === matchUpId)
      if (matchUp && matchUp.winner === undefined) {
        matchUp.winner = newWinner
        const winner = newRun.entries[matchUp.winner === 'A' ? matchUp.entryAId : matchUp.entryBId ? matchUp.entryBId : '']
        if (winner) {
          winner.winsStage2++
          winner.matchHistoryStage2.push('w')
          if (winner.winsStage2 >= 3) {
            winner.advanced = true
          }
        }
        const loser = newRun.entries[matchUp.winner === 'B' ? matchUp.entryAId : matchUp.entryBId]
        if (loser) {
          loser.lossesStage2++
          loser.matchHistoryStage2.push('l')
          if (loser.lossesStage2 >= 3) {
            loser.eliminated = true
          }
        }
        if (newRun.matchUpsStage2.filter(mU => mU.winner === undefined).length === 0 && nextRound <= 5) {
          const newMatchUps = handleRoundEnd(newRun, 2)
          newRun.matchUpsStage2.push(...newMatchUps)
          setNextRound((prev) => prev + 1)
          setScrollToBottom(true)
        } else if (newRun.matchUpsStage2.filter(mU => mU.winner === undefined).length === 0 && nextRound > 5) {
          setStage2Expanded(false)
          const newMatchUps = handlePlayOffSetup(newRun)
          newRun.matchUpsPlayoffs.push(...newMatchUps)
          setScrollToBottom(true)
        }
        setCurrentRun({...newRun})
      }
    }
  }

  const handleMatchUpUpdatePlayoffs = (matchUpId: string, newWinner: 'A' | 'B') => {
    let newRun = {...currentRun}
    let matchUp = newRun.matchUpsPlayoffs.find(mU => mU.matchUpId === matchUpId)
    if (matchUp && matchUp.winner === undefined) {
      matchUp.winner = newWinner
      if (newRun.matchUpsPlayoffs.filter(mU => mU.winner === undefined).length === 0 && nextRound === 7) {
        const newMatchUps: MatchUpType[] = [
          {
            matchUpId: uuidv4(),
            stage: 'playoffs',
            round: 7,
            bracket: 'playoffs',
            entryAId: newRun.matchUpsPlayoffs[0].winner === 'A' ? newRun.matchUpsPlayoffs[0].entryAId : newRun.matchUpsPlayoffs[0].entryBId,
            entryBId: newRun.matchUpsPlayoffs[1].winner === 'A' ? newRun.matchUpsPlayoffs[1].entryAId : newRun.matchUpsPlayoffs[1].entryBId,
            winner: undefined
          },
          {
            matchUpId: uuidv4(),
            stage: 'playoffs',
            round: 7,
            bracket: 'playoffs',
            entryAId: newRun.matchUpsPlayoffs[2].winner === 'A' ? newRun.matchUpsPlayoffs[2].entryAId : newRun.matchUpsPlayoffs[2].entryBId,
            entryBId: newRun.matchUpsPlayoffs[3].winner === 'A' ? newRun.matchUpsPlayoffs[3].entryAId : newRun.matchUpsPlayoffs[3].entryBId,
            winner: undefined
          }
        ]
        newRun.matchUpsPlayoffs.push(...newMatchUps)
        setNextRound((prev) => prev + 1)
      } else if (newRun.matchUpsPlayoffs.filter(mU => mU.winner === undefined).length === 0 && nextRound === 8) {
        setStage2Expanded(false)
        newRun.matchUpsPlayoffs.push(
          {
            matchUpId: uuidv4(),
            stage: 'playoffs',
            round: 8,
            bracket: 'playoffs',
            entryAId: newRun.matchUpsPlayoffs[4].winner === 'A' ? newRun.matchUpsPlayoffs[4].entryAId : newRun.matchUpsPlayoffs[4].entryBId,
            entryBId: newRun.matchUpsPlayoffs[5].winner === 'A' ? newRun.matchUpsPlayoffs[5].entryAId : newRun.matchUpsPlayoffs[5].entryBId,
            winner: undefined
          }
        )
        setNextRound((prev) => prev + 1)
      } else if (newRun.matchUpsPlayoffs.filter(mU => mU.winner === undefined).length === 0 && nextRound === 9) {
        newRun.winner = newRun.matchUpsPlayoffs[6].winner === 'A' ? newRun.entries[newRun.matchUpsPlayoffs[6].entryAId] : newRun.entries[newRun.matchUpsPlayoffs[6].entryBId]
      }
      setCurrentRun({...newRun})
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
                <TiernamentStage key={round} matchUps={matchUps} entries={currentRun.entries} handleMatchUpUpdate={handleMatchUpUpdateStage1} stage={1} />
              )
            })
          }
          {
            (!currentRun.matchUpsStage2 || currentRun.matchUpsStage2.length === 0) &&
              <div ref={curRoundRef}/>
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
                    <TiernamentStage key={round} matchUps={matchUps} entries={currentRun.entries} handleMatchUpUpdate={handleMatchUpUpdateStage2} stage={2} />
                  )
                }
              })
            }
            {
              currentRun.matchUpsStage2.length > 0 &&
              <div ref={curRoundRef}/>
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
            <PlayOffDiagram currentRun={currentRun} handleMatchUpUpdate={handleMatchUpUpdatePlayoffs} />
          </AccordionDetails>
        </CustomAccordion>
      }
    </Box>
  )
}