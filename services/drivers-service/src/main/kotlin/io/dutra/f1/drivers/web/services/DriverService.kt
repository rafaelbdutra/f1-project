package io.dutra.f1.drivers.web.services

import io.dutra.f1.drivers.infra.repositories.DriverRepository
import io.dutra.f1.drivers.model.aggregates.Driver
import io.dutra.f1.drivers.model.aggregates.DriversRace
import io.dutra.f1.drivers.model.aggregates.Season
import io.dutra.f1.drivers.model.aggregates.seasonByYear
import io.dutra.f1.drivers.model.events.DomainEventPublisher
import io.dutra.f1.drivers.web.requests.CreateDriverRequest
import io.dutra.f1.drivers.web.requests.DriverId
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class DriverService(
    private val driverRepository: DriverRepository,
    private val domainEventPublisher: DomainEventPublisher,
) {

    fun list(): Flow<Driver> =
        driverRepository.findAll().asFlow()

    suspend fun create(createDriverRequest: CreateDriverRequest): Driver {
        val dbDriver = driverRepository.findById(createDriverRequest.id).awaitSingleOrNull()
        check(dbDriver == null) { "Driver already exists" }

        val driver = with(createDriverRequest) { Driver(id, code, name, dob, nationality, url) }
        domainEventPublisher.publish(driver.create())
        return driver
    }

    suspend fun get(driverId: DriverId): Driver {
        val dbDriver = driverRepository.findById(driverId.value).awaitSingleOrNull()
        checkNotNull(dbDriver)

        return dbDriver
    }

    suspend fun finishRace(raceFinish: RaceFinish): Driver {
        val driver = get(raceFinish.driverId)
        val seasonByYear = driver.seasonByYear(raceFinish.year)
        seasonByYear.apply {
            if (this == null) {
                driver.seasons.add(Season(raceFinish.year, mutableListOf(raceFinish.driversRace)))
            } else {
                races.find { it.round == raceFinish.driversRace.round } ?: races.add(raceFinish.driversRace)
            }
        }

        domainEventPublisher.publish(driver.finishRace())
        return driver
    }
}

data class RaceFinish(
    val year: Int,
    val driverId: DriverId,
    var driversRace: DriversRace,
)

//fun main() {
//    val driverRaceResultTest = DriverRaceResult(5, 5, 50, 5f, "Finished")
//    val driverRaceTest = DriverRace(2, "Test", "Test", "Test", "Test", "Test", driverRaceResultTest)
//    val season2021 = Season(2021, mutableListOf(driverRaceTest))
//    val season2022 = Season(2022, mutableListOf(driverRaceTest))
//    val driver = Driver("leclerc",
//        "LEC",
//        "Charles Leclerc",
//        "1997-10-16",
//        "Monegasque",
//        "http://en.wikipedia.org/wiki/Charles_Leclerc",
//        seasons = mutableListOf(season2021, season2022))
//    val raceResult = RaceResult(1, 1, 57, 26.0f, "finished", "leclerc", "ferrari")
//    val race = Race(2022,
//        1,
//        "Bahrain Grand Prix",
//        "2022-03-20",
//        "15:00:00Z",
//        "http://en.wikipedia.org/wiki/2022_Bahrain_Grand_Prix",
//        mutableListOf(raceResult))
//
//    val objectMapper = ObjectMapper()
//    println(objectMapper.writeValueAsString(driver))
//
//    val season = driver.seasons.find { it.year == race.year }
//    season.apply {
//        val result = race.results[0]
//        val driverRaceResult = with(result) {
//            DriverRaceResult(position, grid, laps, points, status)
//        }
//        val driverRace = with(race) {
//            DriverRace(round, raceName, date, time, url, result.constructorId, driverRaceResult)
//        }
//
//        if (this == null) {
//            driver.seasons.add(Season(race.year, mutableListOf(driverRace)))
//        } else {
//            races.find { it.round == race.round } ?: races.add(driverRace)
//        }
//    }
//
//    println(objectMapper.writeValueAsString(driver))
//}
