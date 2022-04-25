package io.dutra.f1.drivers.web.requests

data class CreateDriverRequest(
    val id: String,
    val code: String?,
    val name: String,
    val dob: String,
    val nationality: String,
    val url: String,
)