package com.tiernament.server.auth

import com.fasterxml.jackson.databind.ObjectMapper
import com.tiernament.server.api.UserDetailsService
import com.tiernament.server.models.LoginDTO
import com.tiernament.server.models.User
import jakarta.servlet.FilterChain
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import net.minidev.json.JSONObject
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.util.*

class JwtAuthenticationFilter(
    private val jwtTokenUtil: JwtTokenUtil,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService
) :
    UsernamePasswordAuthenticationFilter() {

    init {
        setFilterProcessesUrl("/api/user/login")
    }

    override fun attemptAuthentication(req: HttpServletRequest, response: HttpServletResponse): Authentication {
        val credentials = ObjectMapper().readValue(req.inputStream, LoginDTO::class.java)
        val auth = UsernamePasswordAuthenticationToken(
            credentials.name,
            credentials.password,
            Collections.singleton(SimpleGrantedAuthority("user"))
        )
        return authenticationManager.authenticate(auth)
    }

    override fun successfulAuthentication(
        req: HttpServletRequest?, res: HttpServletResponse, chain: FilterChain?,
        auth: Authentication
    ) {
        val username = (auth.principal as User).username
        val accessToken: String = jwtTokenUtil.generateToken(username)

        val user = userDetailsService.loadUserByUsername(username)
        val sessionId = UUID.randomUUID().toString()
        userDetailsService.addSession(sessionId, user.userId)
        val refreshToken = jwtTokenUtil.generateRefreshToken(user.userId, sessionId)

        // add user to response
        res.contentType = "application/json"
        // create JSON user object
        JSONObject().apply {
            put("user", JSONObject().apply {
                put("userId", user.userId)
                put("name", user.name)
                put("tiernaments", user.tiernaments)
                put("tiernamentRuns", user.tiernamentRuns)
            })
            put("token", accessToken)
        }.let {
            // write JSON user object to response
            res.writer.append(it.toString())
        }

        res.addCookie(Cookie("Refresh", refreshToken).apply {
            maxAge = EXPIRATION_REFRESH_SEC
            path = "/"
            isHttpOnly = true
        })

        //TODO remove
        println("Successful login for user $username")
    }

    override fun unsuccessfulAuthentication(
        request: HttpServletRequest,
        response: HttpServletResponse,
        failed: AuthenticationException
    ) {
        val error = BadCredentialsError()
        response.status = error.status
        response.contentType = "application/json"
        response.writer.append(error.toString())
    }

}

private data class BadCredentialsError(
    val timestamp: Long = Date().time,
    val status: Int = 401,
    val message: String = "errorCredInvalid",
) {
    override fun toString(): String {
        return ObjectMapper().writeValueAsString(this)
    }
}