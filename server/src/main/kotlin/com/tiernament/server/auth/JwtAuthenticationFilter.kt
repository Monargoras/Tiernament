package com.tiernament.server.auth

import com.fasterxml.jackson.databind.ObjectMapper
import com.tiernament.server.api.UserDetailsService
import com.tiernament.server.models.LoginDTO
import com.tiernament.server.models.User
import jakarta.servlet.FilterChain
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
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
        res.addHeader("Authorization", accessToken)
        res.addHeader("Access-Control-Expose-Headers", "Authorization")

        val user = userDetailsService.loadUserByUsername(username)
        val sessionId = UUID.randomUUID().toString()
        userDetailsService.addSession(sessionId, user.userId)
        val refreshToken = jwtTokenUtil.generateRefreshToken(user.userId, sessionId)
        res.addCookie(Cookie("Refresh", refreshToken).apply {
            maxAge = 60 * 60 * 24 * 31
            path = "/"
            isHttpOnly = true
        })
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
    val message: String = "bErrorBadCreds",
) {
    override fun toString(): String {
        return ObjectMapper().writeValueAsString(this)
    }
}