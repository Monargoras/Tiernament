package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "images")
data class Image (
    @Id
    val imageId: String,
    val userId: String,
    val name: String,
)