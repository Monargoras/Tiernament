export type TiernamentType = {
    tiernamentId: String,
    authorId: String,
    name: String,
    description: String,
    date: Date,
    entries: TiernamentEntryType[],
}

export type TiernamentEntryType = {
    entryId: String,
    name: String,
    imageLink: String,
    tier: number,
    score: number,
    history: number[],
}