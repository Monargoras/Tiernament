package com.tiernament.server.api

import com.tiernament.server.auth.JwtTokenUtil
import com.tiernament.server.models.Session
import com.tiernament.server.models.User
import com.tiernament.server.models.UserDTO
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.security.SecureRandom
import java.util.*

interface UserRepo : MongoRepository<User, String> {
    fun findByUserId(id: String): User?
    fun findByName(name: String): User?
}

interface SessionRepo : MongoRepository<Session, String> {
    fun findBySessionId(id: String): Session?
}

@Service
class UserDetailsService(private val repository: UserRepo, private val sessionRepo: SessionRepo): org.springframework.security.core.userdetails.UserDetailsService {
    override fun loadUserByUsername(username: String): User {
        // Create a method in your repo to find a user by its username
        val user = repository.findByName(username) ?: throw UsernameNotFoundException("$username not found")
        return User(
            user.userId,
            user.name,
            user.password,
            Collections.singleton(SimpleGrantedAuthority("user")),
            user.tiernaments,
            user.tiernamentRuns,
        )
    }

    fun addSession(sessionId: String, userId: String) {
        sessionRepo.insert(Session(sessionId, userId, Date()))
    }
}

@RestController
@RequestMapping("/api/user")
class UserApiController(@Autowired val repo: UserRepo, @Autowired val sessionRepo: SessionRepo) {

    @GetMapping("/count")
    fun getUserCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable("id") id: String): ResponseEntity<User> {
        val user = repo.findByUserId(id)
        return if (user != null) ResponseEntity.ok(user) else ResponseEntity.notFound().build()
    }

    @PostMapping("/create")
    fun postUser(@RequestBody body: UserDTO): User {
        // create uuid
        val id = UUID.randomUUID().toString()
        // encode password
        val passwordEncoder = BCryptPasswordEncoder(10, SecureRandom())
        // create user with serverside id
        val user = User(
            userId = id,
            name = body.name,
            password = passwordEncoder.encode(body.password),
            authorities = Collections.singleton(SimpleGrantedAuthority("user")),
            tiernaments = listOf(),
            tiernamentRuns = listOf(),
        )
        return repo.insert(user)
    }

    @PostMapping("/refresh")
    fun refreshUser(@CookieValue("Refresh") refreshToken: String, response: HttpServletResponse): ResponseEntity<*> {
        val jwtUtils = JwtTokenUtil()
        if(jwtUtils.isTokenValid(refreshToken)) {
            sessionRepo.findBySessionId(jwtUtils.getSubject(refreshToken))?.let {
                val newAccessToken = JwtTokenUtil().generateToken(it.userId)
                val sessionId = UUID.randomUUID().toString()
                val newRefreshToken = JwtTokenUtil().generateRefreshToken(it.userId, sessionId)
                sessionRepo.delete(it)
                sessionRepo.insert(Session(sessionId, it.userId, Date()))
                response.addCookie(Cookie("Refresh", newRefreshToken).apply {
                    maxAge = 60 * 60 * 24 * 31
                    path = "/"
                    isHttpOnly = true
                })
                response.addHeader("Authorization", newAccessToken)
                response.addHeader("Access-Control-Expose-Headers", "Authorization")
                return ResponseEntity("", HttpStatus.OK)
            }
        }
        return ResponseEntity("bErrorRefresh", HttpStatus.UNAUTHORIZED)
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