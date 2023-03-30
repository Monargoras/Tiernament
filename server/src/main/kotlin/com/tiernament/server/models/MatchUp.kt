package com.tiernament.server.models

import org.springframework.data.annotation.Id

data class MatchUp (
    @Id
    val matchUpId: String,
    val entryAId: String,
    val entryBId: String,
    val winnerId: String,
)