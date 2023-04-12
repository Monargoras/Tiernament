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

    fun getRandomTenTiernaments(): List<TiernamentTitleDTO> {
        val tiernaments = repo.findAll()
        val randomTen = tiernaments.shuffled().take(10)
        return randomTen.map { getTiernamentTitleDTO(it) }
    }

    fun getTiernamentsByAuthorName(name: String): List<TiernamentTitleDTO> {
        // get author name from user id
        userRepo.findByName(name)?.let { user ->
            return repo.findByAuthorId(user.userId).map { getTiernamentTitleDTO(it) }
        }
        return listOf()
    }

    fun getTiernamentsBySearchTerm(searchTerm: String): List<TiernamentTitleDTO> {
        // search for tiernament name containing search term and the author's display name containing search term
        val tiernaments = repo.findByNameContainingIgnoreCase(searchTerm)
        val users = userRepo.findByDisplayNameEqualsIgnoreCase(searchTerm)
        val userTiernaments = users.map { repo.findByAuthorId(it.userId) }.flatten()
        return (tiernaments + userTiernaments).map { getTiernamentTitleDTO(it) }
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

    @GetMapping("/randomTen")
    fun getRandomTenTiernaments(): List<TiernamentTitleDTO> {
        return service.getRandomTenTiernaments()
    }

    @GetMapping("/author/{name}")
    fun getTiernamentsByAuthorName(@PathVariable("name") name: String): List<TiernamentTitleDTO> {
        return service.getTiernamentsByAuthorName(name)
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