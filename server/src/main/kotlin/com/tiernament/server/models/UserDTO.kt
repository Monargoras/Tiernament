package com.tiernament.server.models

data class UserDTO (
    val userId: String,
    val name: String,
    val displayName: String,
    val avatarId: String,
    val tiernaments: List<String>,
    val tiernamentRuns: List<String>,
) {
    constructor(user: User) : this(
        userId = user.userId,
        name = user.name,
        displayName = user.displayName,
        avatarId = user.avatarId,
        tiernaments = user.tiernaments,
        tiernamentRuns = user.tiernamentRuns,
    )
}