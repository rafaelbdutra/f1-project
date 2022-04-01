package io.dutra.drivers.web

import io.dutra.drivers.model.aggregates.Driver
import io.dutra.drivers.web.requests.CreateDriverRequest
import io.dutra.drivers.web.services.DriverService
import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/drivers")
class DriverController(private val driverService: DriverService) {

    @GetMapping
    fun list(): ResponseEntity<Flow<Driver>> =
        driverService.list().let { ResponseEntity.ok(it) }

    @PostMapping(consumes = [MediaType.APPLICATION_JSON_VALUE])
    suspend fun create(@RequestBody request: CreateDriverRequest): ResponseEntity<Any> = try {
        driverService.create(request).let { ResponseEntity.ok(it) }
    } catch (ex: IllegalStateException) {
        ResponseEntity.status(HttpStatus.CONFLICT).body(ex.message)
    }
}
