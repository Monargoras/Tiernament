package com.tiernament.server.api

import org.bson.Document
import com.mongodb.client.gridfs.GridFSBucket
import com.mongodb.client.gridfs.model.GridFSUploadOptions
import com.tiernament.server.models.Image
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.gridfs.*
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*


interface ImageRepo : MongoRepository<Image, String> {
    fun findByImageId(id: String): Image?
}

@RestController
@RequestMapping("/api/image")
class ImageApiController(@Autowired val repo: ImageRepo, @Autowired val gridFSBucket: GridFSBucket) {

    @GetMapping("/count")
    fun getImageCount(): Int {
        return repo.findAll().count()
    }

    @GetMapping
    fun getImages(): List<Image> {
        return repo.findAll()
    }

    @GetMapping("/{id}")
    fun getImageById(@PathVariable("id") id: String): ResponseEntity<Image> {
        val image = repo.findByImageId(id)
        return if (image != null) ResponseEntity.ok(image) else ResponseEntity.notFound().build()
    }

    @PostMapping(consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun postImage(@RequestPart("image") image: MultipartFile): String {
        val options = GridFSUploadOptions()
            .chunkSizeBytes(358400)
            .metadata(Document("type", "image"))
        val id = gridFSBucket.uploadFromStream(image.originalFilename ?: image.name, image.inputStream, options)

        // TODO add user Id from authorization later
        repo.insert(Image(imageId = id.toString(), userId="placeholder" , name = image.originalFilename ?: image.name))

        return id.toString()
    }

    @PatchMapping("/{id}")
    fun updateImage(@PathVariable("id") id: String, @RequestBody image: Image): Image? {
        return repo.findByImageId(id = id)?.let {
            repo.delete(it)
            repo.insert(image)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteImage(@PathVariable("id") id: String) {
        repo.findByImageId(id)?.let {
            repo.delete(it)
        }
    }
}