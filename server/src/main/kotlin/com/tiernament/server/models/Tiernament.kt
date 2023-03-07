package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.util.Date

@Document(collection = "tiernaments")
data class Tiernament (
    @Id
    @Field("id")
    val tiernamentId: String,
    val authorId: String,
    val name: String,
    val description: String,
    val date: Date,
    val entries: List<TiernamentEntry>,
    // TODO add field presenting history of previous matches, e.g. the best entry in previous playthroughs
)
