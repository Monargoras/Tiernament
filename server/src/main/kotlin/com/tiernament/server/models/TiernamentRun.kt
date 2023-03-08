package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date

@Document(collection = "tiernamentRuns")
data class TiernamentRun (
    @Id
    val runId: String,
    val playerId: String,
    val tiernamentId: Int,
    val date: Date,
    val matchUps: List<MatchUp>,
    val winner: TiernamentEntry,
)