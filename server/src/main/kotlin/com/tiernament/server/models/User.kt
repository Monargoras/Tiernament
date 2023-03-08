package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "users")
data class User(
    @Id
    val userId: String,
    val name: String,
    val tiernaments: List<Int>,
    val tiernamentRuns: List<Int>,
)