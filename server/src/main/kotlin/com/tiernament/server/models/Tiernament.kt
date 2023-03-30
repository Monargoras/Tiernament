package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.Date

@Document(collection = "tiernaments")
data class Tiernament (
    @Id
    val tiernamentId: String,
    val authorId: String,
    val name: String,
    val imageId: String,
    val description: String,
    val date: Date,
    val entries: List<TiernamentEntry>,
    //TODO add field presenting history of previous matches, e.g. the best entry in previous playthroughs
)

data class TiernamentTitleDTO (
    val tiernamentId: String,
    val authorId: String,
    val name: String,
    val imageId: String,
    val description: String,
    val date: Date,
) {
    constructor(tiernament: Tiernament) : this(
        tiernamentId = tiernament.tiernamentId,
        authorId = tiernament.authorId,
        name = tiernament.name,
        imageId = tiernament.imageId,
        description = tiernament.description,
        date = tiernament.date,
    )
}

data class TiernamentDTO (
    val name: String,
    val imageId: String,
    val description: String,
    val entries: List<TiernamentEntry>,
)
