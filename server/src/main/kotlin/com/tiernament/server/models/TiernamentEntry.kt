package com.tiernament.server.models

import org.springframework.data.annotation.Id

data class TiernamentEntry (
    @Id
    val entryId: String,
    val name: String,
    val imageLink: String,
    val placementHistory: List<Int>,
)
