package io.dutra.f1.commons.web

data class ErrorResponse(
    val message: String?,
    val status: Int,
    val errors: List<Error>,
    val code: String?,
)

data class Error(
    val description: String,
    val objectName: String,
    val field: String?,
)
