package com.tiernament.server.models

import java.beans.ConstructorProperties

data class LoginDTO
@ConstructorProperties("name", "password")
constructor(val name: String, val password: String)