package com.tiernament.server.models

import java.util.*

data class TiernamentTitleDTO(
    val tiernamentId: String,
    val authorId: String,
    val authorDisplayName: String,
    val authorAvatarId: String,
    val name: String,
    val imageId: String,
    val description: String,
    val date: Date,
) {
    constructor(tiernament: Tiernament, displayName: String, authorAvatarId: String) : this(
        tiernamentId = tiernament.tiernamentId,
        authorId = tiernament.authorId,
        authorDisplayName = displayName,
        authorAvatarId = authorAvatarId,
        name = tiernament.name,
        imageId = tiernament.imageId,
        description = tiernament.description,
        date = tiernament.date,
    )
}