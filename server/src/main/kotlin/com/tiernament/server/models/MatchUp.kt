package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Field

data class MatchUp (
    @Id
    @Field("id")
    val matchUpId: String,
    val entryA: TiernamentEntry,
    val entryB: TiernamentEntry,
    val winner: TiernamentEntry,
)