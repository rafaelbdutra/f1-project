package io.dutra.drivers

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/drivers")
class DriverController(private val driverRepository: DriverRepository) {

    @GetMapping
    suspend fun list(): Flow<Driver> =
        driverRepository.findAll().asFlow()

    @PostMapping(consumes = [MediaType.APPLICATION_JSON_VALUE])
    suspend fun create(@RequestBody driver: Driver): ResponseEntity<Driver> =
        driverRepository.save(driver)
            .map { ResponseEntity.ok(driver) }.awaitSingle()

}

@Document(collection = "drivers")
data class Driver(
    @Id val id: String,
    val code: String,
    val name: String,
    val dob: String,
    val nationality: String,
    val url: String,
)