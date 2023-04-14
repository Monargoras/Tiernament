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
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayOutputStream
import java.util.*


interface ImageRepo : MongoRepository<Image, String> {
    fun findByImageId(id: String): Image?
}

@Service
class ImageService(
    @Autowired val imageRepo: ImageRepo,
    @Autowired val tiernamentRepo: TiernamentRepo,
    @Autowired val userRepo: UserRepo,
    @Autowired val gridFSBucket: GridFSBucket
) {

    fun getAllImages(): List<Image> {
        return imageRepo.findAll()
    }

    fun getImage(imageId: String): ByteArray? {
        imageRepo.findByImageId(imageId)?.let {
            val outputStream = ByteArrayOutputStream()
            gridFSBucket.downloadToStream(ObjectId(imageId), outputStream)
            return outputStream.toByteArray()
        }
        return null
    }

    fun uploadImage(image: MultipartFile, user: User): String {
        val options = GridFSUploadOptions()
            .chunkSizeBytes(358400)
            .metadata(Document("type", "image"))
        val id = gridFSBucket.uploadFromStream(image.originalFilename ?: image.name, image.inputStream, options)
        imageRepo.insert(Image(imageId = id.toString(), userId=user.userId , name = image.originalFilename ?: image.name))
        return id.toString()
    }

    fun deleteImage(imageId: String): Boolean {
        imageRepo.findByImageId(imageId)?.let {
            gridFSBucket.delete(ObjectId(it.imageId))
            imageRepo.delete(it)
            return true
        }
        return false
    }

    fun cleanup(): String {
        // collect all used image ids and entry image ids in a list
        val usedImageIds = tiernamentRepo.findAll().map { it.imageId }
        val entryImageIds = tiernamentRepo.findAll().map { it.entries }.flatten().map { it.imageId }
        val userAvatars = userRepo.findAll().map { it.avatarId }
        val allUsedImageIds = usedImageIds + entryImageIds + userAvatars

        // delete all images that are not in the list
        var count = 0
        imageRepo.findAll().forEach {
            if (!allUsedImageIds.contains(it.imageId)) {
                gridFSBucket.delete(ObjectId(it.imageId))
                imageRepo.delete(it)
                count++
            }
        }
        return("Deleted $count images")
    }
}

@RestController
@RequestMapping("/api/image")
class ImageApiController(@Autowired val service: ImageService) {

    @GetMapping("/get/count")
    fun getImageCount(): Int {
        return service.getAllImages().size
    }

    // TODO schedule this to run every day, move to authorized image api
    @GetMapping("/get/cleanup")
    fun cleanup(): ResponseEntity<String> {
        return ResponseEntity.ok(service.cleanup())
    }

    @GetMapping("/get/{id}", produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun getImageById(@PathVariable("id") id: String): ResponseEntity<ByteArray> {
        service.getImage(id)?.let {
            return ResponseEntity.ok(it)
        }
        return ResponseEntity.notFound().build()
    }

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun postImage(@RequestPart("image") image: MultipartFile, @AuthenticationPrincipal user: User): ResponseEntity<JSONObject> {
        service.uploadImage(image, user).let {
            return ResponseEntity.ok(JSONObject().apply {
                put("id", it)
            })
        }
    }

    @DeleteMapping("/{id}")
    fun deleteImage(@PathVariable("id") id: String): ResponseEntity<String> {
        service.deleteImage(id).let {
            if(it) return ResponseEntity.ok(id)
            else return ResponseEntity.notFound().build()
        }
    }
}