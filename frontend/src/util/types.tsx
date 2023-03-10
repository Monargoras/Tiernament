export type Tiernament = {
    tiernamentId: String,
    authorId: String,
    name: String,
    description: String,
    date: Date,
    entries: TiernamentEntry[],
}

export type TiernamentEntry = {
    entryId: String,
    name: String,
    imageLink: String,
    tier: number,
    score: number,
    history: number[],
}