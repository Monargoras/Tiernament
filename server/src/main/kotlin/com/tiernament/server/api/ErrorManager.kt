package com.tiernament.server.api

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.multipart.MultipartException

data class ErrorMessageModel(
    var status: Int,
    var message: String
)

@ControllerAdvice
class ExceptionControllerAdvice {

    @ExceptionHandler(MultipartException::class)
    @ResponseStatus(value = HttpStatus.PAYLOAD_TOO_LARGE)
    fun handleMultipartException(ex: IllegalStateException): ResponseEntity<ErrorMessageModel> {

        val errorMessage = ErrorMessageModel(
            status = HttpStatus.PAYLOAD_TOO_LARGE.value(),
            message = "bFileTooLarge"
        )
        return ResponseEntity(errorMessage, HttpStatus.PAYLOAD_TOO_LARGE)
    }
}