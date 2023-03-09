package com.tiernament.server.api

import com.tiernament.server.models.User
import com.tiernament.server.models.UserDraft
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

interface UserRepo : MongoRepository<User, String> {
    fun findByUserId(id: String): User?
}

@RestController
@RequestMapping("/api/user")
class UserApiController(@Autowired val repo: UserRepo) {

    @GetMapping("/count")
    fun getUserCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable("id") id: String): ResponseEntity<User> {
        val user = repo.findByUserId(id)
        return if (user != null) ResponseEntity.ok(user) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun postUser(@RequestBody body: UserDraft): User {
        // create uuid
        val id = UUID.randomUUID().toString()
        // create user with serverside id
        val user = User(
            userId = id,
            name = body.name,
            tiernaments = listOf(),
            tiernamentRuns = listOf(),
        )
        return repo.insert(user)
    }

    @PatchMapping("/{id}")
    fun updateUser(@PathVariable("id") id: String, @RequestBody user: User): User? {
        return repo.findByUserId(id = id)?.let {
            repo.save(it.copy(name = user.name, tiernaments = user.tiernaments, tiernamentRuns = user.tiernamentRuns))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable("id") id: String) {
        repo.findByUserId(id)?.let {
            repo.delete(it)
        }
    }
}