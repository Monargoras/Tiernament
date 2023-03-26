package com.tiernament.server.api

import com.mongodb.client.gridfs.GridFSBucket
import com.tiernament.server.auth.EXPIRATION_REFRESH_SEC
import com.tiernament.server.auth.JwtTokenUtil
import com.tiernament.server.models.Session
import com.tiernament.server.models.User
import com.tiernament.server.models.LoginDTO
import com.tiernament.server.models.UserDTO
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import net.minidev.json.JSONObject
import org.bson.types.ObjectId
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
}

interface SessionRepo : MongoRepository<Session, String> {
    fun findBySessionId(id: String): Session?
    fun findByUserId(id: String): Session?
}

@Service
class UserDetailsService(private val repository: UserRepo, private val sessionRepo: SessionRepo): org.springframework.security.core.userdetails.UserDetailsService {
    override fun loadUserByUsername(username: String): User {
        // Create a method in your repo to find a user by its username
        return repository.findByName(username) ?: throw UsernameNotFoundException("$username not found")
    }

    fun addSession(sessionId: String, userId: String) {
        sessionRepo.findByUserId(userId)?.let {
            sessionRepo.delete(it)
        }
        sessionRepo.insert(Session(sessionId, userId, Date()))
    }
}

@RestController
@RequestMapping("/api/user")
class UserApiController(@Autowired val repo: UserRepo,
                        @Autowired val sessionRepo: SessionRepo,
                        @Autowired val imageRepo: ImageRepo,
                        @Autowired val gridFSBucket: GridFSBucket
) {
    @GetMapping("/count")
    fun getUserCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping("/get/{username}", produces = ["application/json"])
    fun getUserById(@PathVariable("username") username: String): ResponseEntity<UserDTO> {
        val user = repo.findByName(username)
        return if (user != null) ResponseEntity.ok(UserDTO(user)) else ResponseEntity.notFound().build()
    }

    @PostMapping("/logout")
    fun logoutUser(@CookieValue("Refresh") refresh: String, response: HttpServletResponse) {
        val jwtUtils = JwtTokenUtil()
        if(jwtUtils.isTokenValid(refresh)) {
            sessionRepo.findBySessionId(jwtUtils.getSubject(refresh))?.let {
                sessionRepo.delete(it)
            }
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

    @PostMapping("/create", produces = ["application/json"])
    @Throws(Exception::class)
    fun postUser(@RequestBody body: LoginDTO): ResponseEntity<UserDTO> {

        // check if user already exists
        if(repo.findByName(body.name) != null) {
            // return code 403
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        // create uuid
        val id = UUID.randomUUID().toString()
        // encode password
        val passwordEncoder = BCryptPasswordEncoder(10, SecureRandom())
        // create user with serverside id
        val user = User(
            userId = id,
            name = body.name,
            displayName = body.name,
            avatarId= "",
            password = passwordEncoder.encode(body.password),
            authorities = Collections.singleton(SimpleGrantedAuthority("user")),
            tiernaments = listOf(),
            tiernamentRuns = listOf(),
        )
        repo.insert(user)
        return ResponseEntity(UserDTO(user), HttpStatus.CREATED)
    }

    @PostMapping("/refresh", produces = ["application/json"])
    fun refreshUser(@CookieValue("Refresh") refreshToken: String, response: HttpServletResponse): ResponseEntity<JSONObject> {
        val jwtUtils = JwtTokenUtil()
        if(jwtUtils.isTokenValid(refreshToken)) {
            sessionRepo.findBySessionId(jwtUtils.getSubject(refreshToken))?.let {
                val user = repo.findByUserId(it.userId)
                if(user != null) {
                    val newAccessToken = JwtTokenUtil().generateToken(user.name)
                    val sessionId = UUID.randomUUID().toString()
                    val newRefreshToken = JwtTokenUtil().generateRefreshToken(it.userId, sessionId)
                    sessionRepo.delete(it)
                    sessionRepo.insert(Session(sessionId, it.userId, Date()))
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
    }

    @PatchMapping()
    fun updateUser(@RequestBody user: UserDTO, @AuthenticationPrincipal curUser: User): ResponseEntity<UserDTO> {
        repo.findByUserId(id = curUser.userId)?.let {
            val newUser = repo.save(it.copy(displayName = user.displayName, avatarId = user.avatarId, tiernaments = user.tiernaments, tiernamentRuns = user.tiernamentRuns))
            if(curUser.avatarId != "" && curUser.avatarId != user.avatarId) {
                imageRepo.deleteImageByImageId(curUser.avatarId)
                gridFSBucket.delete(ObjectId(curUser.avatarId))
            }
            return ResponseEntity.ok(UserDTO(newUser))
        }
        return ResponseEntity.badRequest().build()
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable("id") id: String) {
        repo.findByUserId(id)?.let {
            repo.delete(it)
        }
    }
}