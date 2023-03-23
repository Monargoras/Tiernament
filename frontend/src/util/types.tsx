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
  tier: number,
  score: number,
  history: number[],
}

export type UserType = {
  userId: string,
  name: string,
  avatarId: string,
  tiernaments: string[],
  tiernamentRuns: string[],
}