package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "users")
data class User(
    @Id
    @Field("id")
    val userId: String,
    val name: String,
    val tiernaments: List<Int>,
    val tiernamentRuns: List<Int>,
)