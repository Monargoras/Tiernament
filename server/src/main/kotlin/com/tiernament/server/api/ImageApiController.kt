package com.tiernament.server.api

import org.bson.Document
import com.mongodb.client.gridfs.GridFSBucket
import com.mongodb.client.gridfs.model.GridFSUploadOptions
import com.tiernament.server.models.Image
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.gridfs.*
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayOutputStream
import java.util.*


interface ImageRepo : MongoRepository<Image, String> {
    fun findByImageId(id: String): Image?
}

@RestController
@RequestMapping("/api/images")
class ImageApiController(@Autowired val repo: ImageRepo, @Autowired val gridFSBucket: GridFSBucket) {

    @GetMapping("/count")
    fun getImageCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping
    fun getImages(): List<Image> {
        return repo.findAll()
    }

    @GetMapping("/{id}", produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun getImageById(@PathVariable("id") id: String): ResponseEntity<ByteArray> {
        repo.findByImageId(id)?.let {
            ByteArrayOutputStream().use { fos ->
                gridFSBucket.downloadToStream(ObjectId(it.imageId), fos)
                return ResponseEntity.ok(fos.toByteArray())
            }
        }
        return ResponseEntity.badRequest().build()
    }

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun postImage(@RequestPart("image") image: MultipartFile): ResponseEntity<String> {
        val options = GridFSUploadOptions()
            .chunkSizeBytes(358400)
            .metadata(Document("type", "image"))
        val id = gridFSBucket.uploadFromStream(image.originalFilename ?: image.name, image.inputStream, options)

        // TODO add user Id from authorization later
        repo.insert(Image(imageId = id.toString(), userId="placeholder" , name = image.originalFilename ?: image.name))

        return ResponseEntity.ok(id.toString())
    }

    @PatchMapping("/{id}")
    fun updateImage(@PathVariable("id") id: String, @RequestPart("image") image: MultipartFile): ResponseEntity<String>? {
        repo.findByImageId(id = id)?.let {
            repo.delete(it)
            gridFSBucket.delete(ObjectId(it.imageId))
            return postImage(image)
        }
        return ResponseEntity.badRequest().build()
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