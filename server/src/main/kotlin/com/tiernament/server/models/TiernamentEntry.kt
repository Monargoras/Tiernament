package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Field

data class TiernamentEntry (
    @Id
    @Field("id")
    val entryId: Int,
    val name: String,
    val imageLink: String,
    val tier: Int,
    val score: Int,
    val history: List<Int>,
)
