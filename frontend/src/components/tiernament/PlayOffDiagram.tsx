import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import Xarrow, { xarrowPropsType } from 'react-xarrows';
import PlayoffMatchUp from './PlayoffMatchUp';
import { MatchUpType, TiernamentRunType } from '../../util/types';


interface PlayOffDiagramProps {
  currentRun: TiernamentRunType,
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
}

export default function PlayOffDiagram(props: PlayOffDiagramProps) {

  const theme = useTheme()

  const styles = {
    tiernamentPlayoffColumn: {
      display: 'flex',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      alignItems: 'center',
      height: '70dvh',
    },
  }

  const getDummyMatchUp = (id: string): MatchUpType => {
    return {
      matchUpId: id,
      stage: 'playoffs',
      round: 0,
      entryAId: '',
      entryBId: '',
      winner: undefined,
      bracket: 'playoffs',
    }
  }

  const quarterMatchUps = props.currentRun.matchUpsPlayoffs.filter((matchUp) => matchUp.round === 6)
  const quarterFinals = quarterMatchUps.length > 0 ? quarterMatchUps : [getDummyMatchUp('quarter1'), getDummyMatchUp('quarter2'), getDummyMatchUp('quarter3'), getDummyMatchUp('quarter4')]
  const semiMatchUps = props.currentRun.matchUpsPlayoffs.filter((matchUp) => matchUp.round === 7)
  const semiFinals = semiMatchUps.length > 0 ? semiMatchUps : [getDummyMatchUp('semi1'), getDummyMatchUp('semi2')]
  const finalMatchUp = props.currentRun.matchUpsPlayoffs.filter((matchUp) => matchUp.round === 8)
  const final = finalMatchUp.length > 0 ? finalMatchUp[0] : getDummyMatchUp('final')

  const arrowProps: xarrowPropsType = {
    start: '',
    end: '',
    color: theme.palette.tertiary.main,
    showHead: false,
    showTail: false,
    strokeWidth: 2,
    path: 'grid',
  }

  return (
    <Grid container>
      <Grid item xs={4} id={'quarter-final-column'} sx={styles.tiernamentPlayoffColumn}>
        {
          quarterFinals.map((entry) => (
            <Box key={entry.matchUpId}>
              <PlayoffMatchUp
                id={entry.matchUpId}
                matchUp={entry}
                entryA={props.currentRun.entries[entry.entryAId]}
                entryB={props.currentRun.entries[entry.entryBId]}
                handleMatchUpUpdate={props.handleMatchUpUpdate}
              />
            </Box>
          ))
        }
      </Grid>
      <Grid item xs={4} id={'semi-final-column'} sx={styles.tiernamentPlayoffColumn}>
        {
          semiFinals.map((entry) => (
            <Box key={entry.matchUpId}>
              <PlayoffMatchUp
                id={entry.matchUpId}
                matchUp={entry}
                entryA={entry.entryAId != '' ? props.currentRun.entries[entry.entryAId] : undefined}
                entryB={entry.entryBId != '' ? props.currentRun.entries[entry.entryBId] : undefined}
                handleMatchUpUpdate={props.handleMatchUpUpdate}
              />
            </Box>
          ))
        }
        <Xarrow {...arrowProps} start={quarterFinals[0].matchUpId} end={semiFinals[0].matchUpId} />
        <Xarrow {...arrowProps} start={quarterFinals[1].matchUpId} end={semiFinals[0].matchUpId} />
        <Xarrow {...arrowProps} start={quarterFinals[2].matchUpId} end={semiFinals[1].matchUpId} />
        <Xarrow {...arrowProps} start={quarterFinals[3].matchUpId} end={semiFinals[1].matchUpId} />
      </Grid>
      <Grid item xs={4} id={'final-column'} sx={styles.tiernamentPlayoffColumn}>
        <PlayoffMatchUp
          id={final.matchUpId}
          matchUp={final}
          entryA={final.entryAId != '' ? props.currentRun.entries[final.entryAId] : undefined}
          entryB={final.entryBId != '' ? props.currentRun.entries[final.entryBId] : undefined}
          handleMatchUpUpdate={props.handleMatchUpUpdate}
        />
        <Xarrow {...arrowProps} start={semiFinals[0].matchUpId} end={final.matchUpId} />
        <Xarrow {...arrowProps} start={semiFinals[1].matchUpId} end={final.matchUpId} />
      </Grid>
    </Grid>
  )
}