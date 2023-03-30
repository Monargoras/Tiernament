package com.tiernament.server.models

import org.springframework.data.annotation.Id

data class TiernamentRunEntry(
    @Id
    val entryId: String,
    val name: String,
    val imageLink: String,
    val placementHistory: List<Int>,
    val eliminated: Boolean,
    val winsStage1: Int,
    val winsStage2: Int?,
    val lossesStage1: Int,
    val lossesStage2: Int?,
)