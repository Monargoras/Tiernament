package com.tiernament.server.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*

const val EXPIRATION_ACCESS = 1000 * 60 * 60 * 24
const val EXPIRATION_REFRESH_SEC = 60 * 60 * 24 * 31
const val EXPIRATION_REFRESH = 1000 * 60 * 60 * 24 * 31L

@Component
class JwtTokenUtil {

    // TODO update development secret
    private val secret = "TiernamentSuperSecureDevelopmentSecret"

    fun generateToken(username: String): String {
        val key: Key = Keys.hmacShaKeyFor(secret.toByteArray())
        return Jwts.builder().setSubject(username).setExpiration(Date(System.currentTimeMillis() + EXPIRATION_ACCESS))
            .signWith(key).compact()
    }

    fun generateRefreshToken(userId: String, sessionId: String): String {
        val key: Key = Keys.hmacShaKeyFor(secret.toByteArray())
        return Jwts.builder().setClaims(mapOf("sub" to sessionId, "userId" to userId)).setExpiration(Date(System.currentTimeMillis() + EXPIRATION_REFRESH))
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