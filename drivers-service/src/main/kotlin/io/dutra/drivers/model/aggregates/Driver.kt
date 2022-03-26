package io.dutra.drivers.model.aggregates

import io.dutra.drivers.model.events.DriverCreated
import io.dutra.drivers.model.events.DomainEventRegister
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "drivers")
class Driver(
    @Id val id: String,
    val code: String,
    val name: String,
    val dob: String,
    val nationality: String,
    val url: String,
    var meta: Meta? = null,
    var seasons: List<Season>? = null,
) : DomainEventRegister<Driver>() {

    fun create(): Driver {
        val now = LocalDateTime.now()
        this.meta = Meta(now, now)

        register(DriverCreated(this, now))
        return this
    }
}

data class Meta(
    val created: LocalDateTime,
    val lastModified: LocalDateTime,
)

data class Season(val year: Number)