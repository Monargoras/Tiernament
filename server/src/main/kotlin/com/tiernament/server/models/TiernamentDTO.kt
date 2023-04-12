package com.tiernament.server.models

data class TiernamentDTO (
    val name: String,
    val imageId: String,
    val description: String,
    val entries: List<TiernamentEntry>,
)