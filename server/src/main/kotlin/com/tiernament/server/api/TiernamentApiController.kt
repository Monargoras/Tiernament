package com.tiernament.server.api

import com.tiernament.server.models.Tiernament
import com.tiernament.server.models.TiernamentDTO
import com.tiernament.server.models.TiernamentTitleDTO
import com.tiernament.server.models.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.util.*

interface TiernamentRepo : MongoRepository<Tiernament, String> {
    fun findByTiernamentId(id: String): Tiernament?
    fun findByAuthorId(id: String): List<Tiernament>
    fun findByNameContainingIgnoreCase(name: String): List<Tiernament>
}

@Service
class TiernamentService(@Autowired val repo: TiernamentRepo, @Autowired val userRepo: UserRepo) {
    val getTiernamentTitleDTO = { tiernament: Tiernament ->
        val user = userRepo.findByUserId(tiernament.authorId)
        TiernamentTitleDTO(
            tiernament,
            user?.displayName ?: "",
            user?.avatarId ?: ""
        )
    }

    fun getTiernamentCount(): Int {
        return repo.findAll().count()
    }

    fun getTiernaments(): List<TiernamentTitleDTO> {
        return repo.findAll().map { getTiernamentTitleDTO(it) }
    }

    fun getTiernamentsByAuthorId(id: String): List<TiernamentTitleDTO> {
        return repo.findByAuthorId(id).map { getTiernamentTitleDTO(it) }
    }

    fun getTiernamentsBySearchTerm(searchTerm: String): List<TiernamentTitleDTO> {
        return repo.findByNameContainingIgnoreCase(searchTerm).map { getTiernamentTitleDTO(it) }
    }

    fun getTiernamentById(id: String): Tiernament? {
        return repo.findByTiernamentId(id)
    }

    fun postTiernament(body: TiernamentDTO, curUser: User): Tiernament {
        // create uuid
        val id = UUID.randomUUID().toString()
        // create tiernament with serverside id and date
        val tiernament = Tiernament(
            tiernamentId = id,
            authorId = curUser.userId,
            name = body.name,
            imageId = body.imageId,
            description = body.description,
            date = Date(),
            entries = body.entries,
        )
        return repo.insert(tiernament)
    }

    fun updateTiernament(id: String, tiernament: Tiernament): Tiernament? {
        return repo.findByTiernamentId(id = id)?.let {
            repo.save(it.copy(name = tiernament.name, imageId = tiernament.imageId, description = tiernament.description, entries = tiernament.entries))
        }
    }

    fun deleteTiernament(id: String) {
        repo.findByTiernamentId(id)?.let {
            repo.delete(it)
        }
    }
}

@RestController
@RequestMapping("/api/tiernament/get")
class PublicTiernamentApiController(@Autowired val service: TiernamentService) {

    @GetMapping("/count")
    fun getTiernamentCount(): Int {
        return service.getTiernamentCount()
    }

    @GetMapping
    fun getTiernaments(): List<TiernamentTitleDTO> {
        return service.getTiernaments()
    }

    @GetMapping("/author/{id}")
    fun getTiernamentsByAuthorId(@PathVariable("id") id: String): List<TiernamentTitleDTO> {
        return service.getTiernamentsByAuthorId(id)
    }

    @GetMapping("/search/{searchTerm}")
    fun getTiernamentsBySearchTerm(@PathVariable("searchTerm") name: String): List<TiernamentTitleDTO> {
        return service.getTiernamentsBySearchTerm(name)
    }

    @GetMapping("/{id}")
    fun getTiernamentById(@PathVariable("id") id: String): ResponseEntity<Tiernament> {
        val tiernament = service.getTiernamentById(id)
        return if (tiernament != null) ResponseEntity.ok(tiernament) else ResponseEntity.notFound().build()
    }
}

@RestController
@RequestMapping("/api/tiernament/edit")
class PrivateTiernamentApiController(@Autowired val service: TiernamentService) {

    @PostMapping
    fun postTiernament(@RequestBody body: TiernamentDTO, @AuthenticationPrincipal curUser: User): Tiernament {
        return service.postTiernament(body, curUser)
    }

    @PatchMapping("/{id}")
    fun updateTiernament(@PathVariable("id") id: String, @RequestBody tiernament: Tiernament): Tiernament? {
        return service.updateTiernament(id, tiernament)
    }

    @DeleteMapping("/{id}")
    fun deleteTiernament(@PathVariable("id") id: String) {
        service.deleteTiernament(id)
    }
}