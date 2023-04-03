import React from 'react';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';
import { Box } from '@mui/material';
import SwissMatchUp from "./SwissMatchUp";


interface TiernamentRoundProps {
  matchUps: MatchUpType[],
  entries: { [id: string]: TiernamentRunEntryType },
}

export default function TiernamentRound(props: TiernamentRoundProps) {

  const lowerBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'lower')
  const middleBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'middle')
  const upperBracket = props.matchUps.filter(matchUp => matchUp.bracket === 'upper')

  return (
    <Box>
      <Box>
        {
          lowerBracket.map(matchUp => (
            <SwissMatchUp key={matchUp.matchUpId} matchUp={matchUp} entryA={props.entries[matchUp.entryAId]} entryB={props.entries[matchUp.entryBId]} />
          ))
        }
      </Box>
      <Box>
        {
          middleBracket.map(matchUp => (
            <SwissMatchUp key={matchUp.matchUpId} matchUp={matchUp} entryA={props.entries[matchUp.entryAId]} entryB={props.entries[matchUp.entryBId]} />
          ))
        }
      </Box>
      <Box>
        {
          upperBracket.map(matchUp => (
            <SwissMatchUp key={matchUp.matchUpId} matchUp={matchUp} entryA={props.entries[matchUp.entryAId]} entryB={props.entries[matchUp.entryBId]} />
          ))
        }
      </Box>
    </Box>
  )
}