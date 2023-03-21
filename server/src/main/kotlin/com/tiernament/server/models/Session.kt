package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "sessions")
data class Session(
    @Id
    val sessionId: String,
    val userId: String,
)