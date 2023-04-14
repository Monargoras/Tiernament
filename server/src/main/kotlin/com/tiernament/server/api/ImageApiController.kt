package com.tiernament.server.api

import com.mongodb.client.gridfs.GridFSBucket
import com.mongodb.client.gridfs.model.GridFSUploadOptions
import com.tiernament.server.models.Image
import com.tiernament.server.models.User
import net.minidev.json.JSONObject
import org.bson.Document
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.gridfs.*
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayOutputStream
import java.util.*


interface ImageRepo : MongoRepository<Image, String> {
    fun findByImageId(id: String): Image?
    fun deleteImageByImageId(id: String)
}

@RestController
@RequestMapping("/api/image")
class ImageApiController(
    @Autowired val repo: ImageRepo,
    @Autowired val gridFSBucket: GridFSBucket,
    @Autowired val tiernamentRepo: TiernamentRepo,
    @Autowired val userRepo: UserRepo
) {

    @GetMapping("/get/count")
    fun getImageCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping("/get/cleanup")
    fun cleanup(): ResponseEntity<String> {
        // collect all used image ids and entry image ids in a list
        val usedImageIds = tiernamentRepo.findAll().map { it.imageId }
        val entryImageIds = tiernamentRepo.findAll().map { it.entries }.flatten().map { it.imageId }
        val userAvatars = userRepo.findAll().map { it.avatarId }
        val allImageIds = usedImageIds + entryImageIds + userAvatars

        // delete all images that are not in the list
        var count = 0
        repo.findAll().forEach {
            if (!allImageIds.contains(it.imageId)) {
                gridFSBucket.delete(ObjectId(it.imageId))
                repo.delete(it)
                count++
            }
        }
        return ResponseEntity.ok("Deleted $count images.")
    }

    @GetMapping("/get/{id}", produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun getImageById(@PathVariable("id") id: String): ResponseEntity<ByteArray> {
        repo.findByImageId(id)?.let {
            ByteArrayOutputStream().use { fos ->
                gridFSBucket.downloadToStream(ObjectId(it.imageId), fos)
                return ResponseEntity.ok(fos.toByteArray())
            }
        }
        return ResponseEntity.notFound().build()
    }

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun postImage(@RequestPart("image") image: MultipartFile, @AuthenticationPrincipal user: User): ResponseEntity<JSONObject> {
        val options = GridFSUploadOptions()
            .chunkSizeBytes(358400)
            .metadata(Document("type", "image"))
        val id = gridFSBucket.uploadFromStream(image.originalFilename ?: image.name, image.inputStream, options)

        repo.insert(Image(imageId = id.toString(), userId=user.userId , name = image.originalFilename ?: image.name))

        JSONObject().apply {
            put("id", id.toString())
        }.let { json ->
            return ResponseEntity.ok(json)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteImage(@PathVariable("id") id: String): ResponseEntity<String> {
        repo.findByImageId(id)?.let {
            repo.delete(it)
            gridFSBucket.delete(ObjectId(it.imageId))
            return ResponseEntity.ok(id)
        }
        return ResponseEntity.badRequest().build()
    }
}