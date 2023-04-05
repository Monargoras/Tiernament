export type TiernamentTitleType = {
  tiernamentId: string,
  authorId: string,
  name: string,
  imageId: string,
  description: string,
  date: Date,
}

export type TiernamentDTO = {
  name: string,
  imageId: string,
  description: string,
  entries: TiernamentEntryType[],
}

export type TiernamentType = {
  tiernamentId: string,
  authorId: string,
  name: string,
  imageId: string,
  description: string,
  date: Date,
  entries: TiernamentEntryType[],
}

export type TiernamentEntryType = {
  entryId: string,
  name: string,
  imageId: string,
  placementHistory: number[],
}

export type TiernamentRunType = {
  runId: string,
  playerId: string,
  tiernamentId: string,
  date: Date,
  entries: { [id: string]: TiernamentRunEntryType },
  matchUpsStage1: MatchUpType[],
  matchUpsStage2: MatchUpType[] | undefined,
  matchUpsPlayoffs: MatchUpType[],
  winner: TiernamentRunEntryType | undefined,
}

export type MatchUpType = {
  matchUpId: string,
  stage: 'stage1' | 'stage2' | 'playoffs',
  round: number,
  bracket: 'lower' | 'middle' | 'upper' | 'playoffs',
  entryAId: string,
  entryBId: string,
  winner: 'A' | 'B' | undefined,
}

export type TiernamentRunEntryType = {
  entryId: string,
  name: string,
  imageId: string,
  matchHistoryStage1: string[],
  matchHistoryStage2: string[],
  eliminated: boolean,
  advanced: boolean,
  winsStage1: number,
  winsStage2: number,
  lossesStage1: number,
  lossesStage2: number,
}

export type UserType = {
  userId: string,
  name: string,
  displayName: string,
  avatarId: string,
  tiernaments: string[],
  tiernamentRuns: string[],
}