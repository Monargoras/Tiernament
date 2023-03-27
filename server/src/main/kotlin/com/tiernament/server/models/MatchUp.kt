package com.tiernament.server.models

import org.springframework.data.annotation.Id

data class MatchUp (
    @Id
    val matchUpId: String,
    val entryA: TiernamentEntry,
    val entryB: TiernamentEntry,
    val winnerId: String,
)