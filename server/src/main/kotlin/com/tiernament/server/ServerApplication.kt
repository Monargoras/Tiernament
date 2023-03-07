package com.tiernament.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
@RestController
class ServerApplication { }

fun main(args: Array<String>) {
    runApplication<ServerApplication>(*args)
}