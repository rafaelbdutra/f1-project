package io.dutra.f1.drivers.web

import io.dutra.f1.drivers.model.aggregates.Driver
import io.dutra.f1.drivers.web.requests.CreateDriverRequest
import io.dutra.f1.drivers.web.requests.DriverId
import io.dutra.f1.drivers.web.services.DriverService
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

    @GetMapping("/{id}")
    suspend fun get(@PathVariable id: String): Driver = driverService.get(DriverId(id))
}
