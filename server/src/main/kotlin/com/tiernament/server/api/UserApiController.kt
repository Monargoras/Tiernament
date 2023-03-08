package com.tiernament.server.api

import com.tiernament.server.models.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

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
    fun postUser(@RequestBody user: User): User {
        return repo.insert(user)
    }

    @PatchMapping("/{id}")
    fun updateUser(@PathVariable("id") id: String): User? {
        return repo.findByUserId(id = id)?.let {
            repo.save(it.copy(name = "Update"))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable("id") id: String) {
        repo.findByUserId(id)?.let {
            repo.delete(it)
        }
    }
}