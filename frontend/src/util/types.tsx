export type TiernamentTitleType = {
  tiernamentId: string,
  authorId: string,
  name: string,
  description: string,
  date: Date,
}

export type TiernamentType = {
  tiernamentId: string,
  authorId: string,
  name: string,
  description: string,
  date: Date,
  entries: TiernamentEntryType[],
}

export type TiernamentEntryType = {
  entryId: string,
  name: string,
  imageLink: string,
  placementHistory: number[],
}

export type TiernamentRunType = {
  runId: String,
  playerId: String,
  tiernamentId: number,
  date: Date,
  matchUps: MatchUpType[],
  winner: TiernamentEntryType | undefined,
}

export type MatchUpType = {
  matchUpId: string,
  entry1: TiernamentEntryType,
  entry2: TiernamentEntryType,
  winnerId: string,
}

export type UserType = {
  userId: string,
  name: string,
  displayName: string,
  avatarId: string,
  tiernaments: string[],
  tiernamentRuns: string[],
}