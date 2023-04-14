package com.tiernament.server.api

import com.tiernament.server.auth.EXPIRATION_REFRESH_SEC
import com.tiernament.server.auth.JwtTokenUtil
import com.tiernament.server.models.Session
import com.tiernament.server.models.User
import com.tiernament.server.models.LoginDTO
import com.tiernament.server.models.UserDTO
import io.jsonwebtoken.ExpiredJwtException
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import net.minidev.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
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
    fun findByDisplayNameEqualsIgnoreCase(name: String): List<User>
}

interface SessionRepo : MongoRepository<Session, String> {
    fun findBySessionId(id: String): Session?
    fun findByUserId(id: String): List<Session>?
}

@Service
class SessionService(@Autowired val sessionRepo: SessionRepo) {
    fun addSession(sessionId: String, userId: String) {
        sessionRepo.insert(Session(sessionId, userId, Date()))
    }

    fun findBySessionId(sessionId: String): Session? {
        return sessionRepo.findBySessionId(sessionId)
    }

    fun deleteSession(sessionId: String) {
        sessionRepo.findBySessionId(sessionId)?.let {
            sessionRepo.delete(it)
        }
    }

    fun deleteSessionsForUser(userId: String) {
        sessionRepo.findByUserId(userId)?.let {
            sessionRepo.deleteAll(it)
        }
    }
}

@Service
class UserService(
    @Autowired val userRepo: UserRepo,
    @Autowired val sessionService: SessionService,
    @Autowired val imageService: ImageService,
) : org.springframework.security.core.userdetails.UserDetailsService {

    override fun loadUserByUsername(username: String): User {
        return userRepo.findByName(username) ?: throw UsernameNotFoundException("$username not found")
    }

    fun findAll(): List<User> {
        return userRepo.findAll()
    }

    fun findByUserId(userId: String): User? {
        return userRepo.findByUserId(userId)
    }

    fun findByUsername(username: String): User? {
        return userRepo.findByName(username)
    }

    fun findByDisplayName(displayName: String): List<User> {
        return userRepo.findByDisplayNameEqualsIgnoreCase(displayName)
    }

    fun createUser(loginDTO: LoginDTO): UserDTO? {
        // check if user already exists
        if(userRepo.findByName(loginDTO.name) != null) {
            return null
        }

        // create uuid
        val id = UUID.randomUUID().toString()
        // encode password
        val passwordEncoder = BCryptPasswordEncoder(10, SecureRandom())
        // create user with serverside id
        val user = User(
            userId = id,
            name = loginDTO.name,
            displayName = loginDTO.name,
            avatarId= "",
            password = passwordEncoder.encode(loginDTO.password),
            authorities = Collections.singleton(SimpleGrantedAuthority("user")),
            tiernaments = listOf(),
            tiernamentRuns = listOf(),
        )
        userRepo.save(user)
        return UserDTO(user)
    }

    fun updateUser(newUser: UserDTO): UserDTO? {
        var user = userRepo.findByUserId(newUser.userId) ?: throw UsernameNotFoundException("${newUser.userId} not found")
        if(user.avatarId != "" && user.avatarId != newUser.avatarId) {
            imageService.deleteImage(user.avatarId)
        }
        user = user.copy(
            displayName = newUser.displayName,
            avatarId = newUser.avatarId,
            tiernaments = newUser.tiernaments,
            tiernamentRuns = newUser.tiernamentRuns,
        )
        return UserDTO(userRepo.save(user))
    }

    fun deleteUser(userId: String) {
        val user = userRepo.findByUserId(userId) ?: throw UsernameNotFoundException("$userId not found")
        sessionService.deleteSessionsForUser(userId)
        userRepo.delete(user)
    }
}

@RestController
@RequestMapping("/api/user")
class UserApiController(@Autowired val userService: UserService, @Autowired val sessionService: SessionService) {
    @GetMapping("/count")
    fun getUserCount(): Int {
        return userService.findAll().size
    }

    @GetMapping("/get/{username}", produces = ["application/json"])
    fun getUserById(@PathVariable("username") username: String): ResponseEntity<UserDTO> {
        val user = userService.findByUsername(username)
        return if (user != null) ResponseEntity.ok(UserDTO(user)) else ResponseEntity.notFound().build()
    }

    @PostMapping("/logout")
    fun logoutUser(@CookieValue("Refresh") refresh: String, response: HttpServletResponse) {
        val jwtUtils = JwtTokenUtil()
        if(jwtUtils.isTokenValid(refresh)) {
            sessionService.deleteSession(jwtUtils.getSubject(refresh))

            val cookie = Cookie("Refresh", "")
            cookie.maxAge = 0
            cookie.path = "/"
            response.addCookie(cookie)
            response.status = 200

            // TODO remove
            println("logged out session ${jwtUtils.getSubject(refresh)}")
        } else {
            response.status = 400
        }
    }

    @PostMapping("/logoutAll")
    fun logoutAllUser(@CookieValue("Refresh") refresh: String, response: HttpServletResponse) {
        val jwtUtils = JwtTokenUtil()
        return if(jwtUtils.isTokenValid(refresh)) {
            sessionService.deleteSessionsForUser(jwtUtils.getSubject(refresh))

            val cookie = Cookie("Refresh", "")
            cookie.maxAge = 0
            cookie.path = "/"
            response.addCookie(cookie)
            response.status = 200

            // TODO remove
            println("logged out all sessions for user ${jwtUtils.getSubject(refresh)}")
        } else {
            response.status = 400
        }
    }

    @PostMapping("/create", produces = ["application/json"])
    @Throws(Exception::class)
    fun postUser(@RequestBody body: LoginDTO): ResponseEntity<UserDTO> {
        val user = userService.createUser(body) ?: return ResponseEntity(HttpStatus.CONFLICT)
        return ResponseEntity(user, HttpStatus.CREATED)
    }

    @PostMapping("/refresh", produces = ["application/json"])
    fun refreshUser(@CookieValue("Refresh") refreshToken: String, response: HttpServletResponse): ResponseEntity<JSONObject> {
        val jwtUtils = JwtTokenUtil()

        try {
            val isValid = jwtUtils.isTokenValid(refreshToken)
            if(isValid) {
                sessionService.findBySessionId(jwtUtils.getSubject(refreshToken))?.let {
                    val user = userService.findByUserId(it.userId)
                    if(user != null) {
                        val newAccessToken = JwtTokenUtil().generateToken(user.name)
                        val sessionId = UUID.randomUUID().toString()
                        val newRefreshToken = JwtTokenUtil().generateRefreshToken(it.userId, sessionId)
                        sessionService.deleteSession(it.sessionId)
                        sessionService.addSession(sessionId, it.userId)
                        response.addCookie(Cookie("Refresh", newRefreshToken).apply {
                            maxAge = EXPIRATION_REFRESH_SEC
                            path = "/"
                            isHttpOnly = true
                        })

                        // TODO remove
                        println("refreshing token for user ${user.name}")

                        JSONObject().apply {
                            put("user", UserDTO(user))
                            put("token", newAccessToken)
                        }.let { resBody ->
                            return ResponseEntity(resBody, HttpStatus.OK)
                        }
                    }
                }
            }
            JSONObject().apply {
                put("message", "bErrorRefresh")
            }.let { resBody ->
                return ResponseEntity(resBody, HttpStatus.UNAUTHORIZED)
            }
        } catch (e: ExpiredJwtException) {
            JSONObject().apply {
                put("message", "bErrorRefresh")
            }.let { resBody ->
                return ResponseEntity(resBody, HttpStatus.UNAUTHORIZED)
            }
        }
    }

    @PatchMapping
    fun updateUser(@RequestBody user: UserDTO, @AuthenticationPrincipal curUser: User): ResponseEntity<UserDTO> {
        if(curUser.userId == user.userId) {
            val updatedUser = userService.updateUser(user)
            return ResponseEntity.ok(updatedUser)
        }
        return ResponseEntity(HttpStatus.UNAUTHORIZED)
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable("id") id: String) {
        userService.deleteUser(id)
    }
}