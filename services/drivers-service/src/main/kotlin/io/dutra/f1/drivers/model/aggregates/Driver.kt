package io.dutra.f1.drivers.model.aggregates

import io.dutra.f1.drivers.model.events.DomainEventRegister
import io.dutra.f1.drivers.model.events.DriverCreated
import io.dutra.f1.drivers.model.events.DriverRaceFinished
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "drivers")
class Driver(
    @Id val id: String,
    val code: String?,
    val name: String,
    val dob: String,
    val nationality: String,
    val url: String,
    var meta: Meta? = null,
    var seasons: MutableList<Season> = mutableListOf(),
) : DomainEventRegister<Driver>() {

    fun create(): Driver {
        val now = LocalDateTime.now()
        this.meta = Meta(now, now)

        register(DriverCreated(this, now))
        return this
    }

    fun finishRace(): Driver {
        register(DriverRaceFinished(this, LocalDateTime.now()))
        return this
    }
}

data class Meta(
    val created: LocalDateTime,
    val lastModified: LocalDateTime,
)

data class Season(
    val year: Number,
    val races: MutableList<DriverRace> = mutableListOf(),
)

data class DriverRace(
    val round: Int,
    val raceName: String,
    val date: String,
    val time: String,
    val url: String,
    val constructorId: String,
    val result: DriverRaceResult,
)

data class DriverRaceResult(
    val position: Int,
    val grid: Int,
    val laps: Int,
    val points: Float,
    val status: String,
)
