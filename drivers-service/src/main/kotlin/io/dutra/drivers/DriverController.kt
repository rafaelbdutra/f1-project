package io.dutra.drivers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/drivers")
class DriverController {

    @GetMapping
    suspend fun list(): ResponseEntity<Driver> =
        ResponseEntity.ok(
            Driver(
                "VER",
                "max_verstappen",
                33,
                "Max",
                "Verstappen",
                "1997-09-30",
                "Dutch",
                "http://en.wikipedia.org/wiki/Max_Verstappen"
            )
        )
}

data class Driver(
    val code: String,
    val driverId: String,
    val permanentNumber: Number,
    val givenName: String,
    val familyName: String,
    val dateOfBirth: String,
    val nationality: String,
    val url: String,
)