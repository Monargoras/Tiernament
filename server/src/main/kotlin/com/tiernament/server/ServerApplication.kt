package com.tiernament.server

import com.mongodb.client.MongoClient
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoDatabase
import com.mongodb.client.gridfs.GridFSBucket
import com.mongodb.client.gridfs.GridFSBuckets
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
@RestController
class ServerApplication { }

@Configuration
class CorsConfiguration: WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3333")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
    }
}

@Configuration
class MongoConfiguration {
    @Bean
    fun mongoClient(): MongoClient {
        return MongoClients.create("mongodb://localhost:27017")
    }

    @Bean
    fun mongoDatabase(client: MongoClient): MongoDatabase {
        return client.getDatabase("tiernaments")
    }

    @Bean
    fun gridFSBucket(database: MongoDatabase): GridFSBucket {
        return GridFSBuckets.create(database, "images")
    }
}

fun main(args: Array<String>) {
    runApplication<ServerApplication>(*args)
}