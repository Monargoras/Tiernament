package com.tiernament.server.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*

@Component
class JwtTokenUtil {

    // TODO update development secret
    private val secret = "TiernamentSuperSecureDevelopmentSecret"
    private val expirationAccess = 1000 * 60 * 60 * 24
    private val expirationRefresh = 1000 * 60 * 60 * 24 * 7

    fun generateToken(username: String): String {
        val key: Key = Keys.hmacShaKeyFor(secret.toByteArray())
        return Jwts.builder().setSubject(username).setExpiration(Date(System.currentTimeMillis() + expirationAccess))
            .signWith(key).compact()
    }

    fun generateRefreshToken(userId: String, sessionId: String): String {
        val key: Key = Keys.hmacShaKeyFor(secret.toByteArray())
        return Jwts.builder().setClaims(mapOf("sub" to sessionId, "userId" to userId)).setExpiration(Date(System.currentTimeMillis() + expirationRefresh))
            .signWith(key).compact()
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parserBuilder().setSigningKey(secret.toByteArray()).build().parseClaimsJws(token).body
    }

    fun getSubject(token: String): String {
        return getClaims(token).subject
    }

    fun isTokenValid(token: String): Boolean {
        val claims = getClaims(token)
        val expirationDate = claims.expiration
        val now = Date(System.currentTimeMillis())
        return now.before(expirationDate)
    }
}