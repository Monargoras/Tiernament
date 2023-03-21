package com.tiernament.server.api

import com.tiernament.server.models.Tiernament
import com.tiernament.server.models.TiernamentDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

interface TiernamentRepo : MongoRepository<Tiernament, String> {
    fun findByTiernamentId(id: String): Tiernament?
}

@RestController
@RequestMapping("/api/tiernament")
class TiernamentApiController(@Autowired val repo: TiernamentRepo) {

    @GetMapping("/count")
    fun getTiernamentCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping
    fun getTiernaments(): List<Tiernament> {
        return repo.findAll()
    }

    @GetMapping("/{id}")
    fun getTiernamentById(@PathVariable("id") id: String): ResponseEntity<Tiernament> {
        val tiernament = repo.findByTiernamentId(id)
        return if (tiernament != null) ResponseEntity.ok(tiernament) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun postTiernament(@RequestBody body: TiernamentDTO): Tiernament {
        // create uuid
        val id = UUID.randomUUID().toString()
        // create tiernament with serverside id and date
        val tiernament = Tiernament(
            tiernamentId = id,
            authorId = body.authorId,
            name = body.name,
            description = body.description,
            date = Date(),
            entries = body.entries,
        )
        return repo.insert(tiernament)
    }

    @PatchMapping("/{id}")
    fun updateTiernament(@PathVariable("id") id: String, @RequestBody tiernament: Tiernament): Tiernament? {
        return repo.findByTiernamentId(id = id)?.let {
            repo.save(it.copy(name = tiernament.name, description = tiernament.description, entries = tiernament.entries))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteTiernament(@PathVariable("id") id: String) {
        repo.findByTiernamentId(id)?.let {
            repo.delete(it)
        }
    }
}