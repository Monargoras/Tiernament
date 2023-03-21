package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "sessions")
data class Session(
    @Id
    val sessionId: String,
    val userId: String,
    val createdAt: Date,
)