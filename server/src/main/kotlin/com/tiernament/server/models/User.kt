package com.tiernament.server.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.beans.ConstructorProperties

@Document(collection = "users")
data class User (
    @Id
    val userId: String,
    val name: String,
    private val password: String,
    private val authorities: MutableCollection<GrantedAuthority>,
    val tiernaments: List<String>,
    val tiernamentRuns: List<String>,
) : UserDetails {
    override fun getAuthorities() = authorities
    override fun getPassword() = password
    override fun getUsername() = name
    override fun isAccountNonExpired() = true
    override fun isAccountNonLocked() = true
    override fun isCredentialsNonExpired() = true
    override fun isEnabled() = true
}

data class LoginDTO
@ConstructorProperties("name", "password")
constructor(val name: String, val password: String)

data class UserDTO (
    val userId: String,
    val name: String,
    val tiernaments: List<String>,
    val tiernamentRuns: List<String>,
)