package io.dutra.f1.drivers.web.services

import io.dutra.f1.commons.model.aggregates.Race
import io.dutra.f1.drivers.model.aggregates.DriversRace
import io.dutra.f1.drivers.model.aggregates.DriversRaceResult
import io.dutra.f1.drivers.web.requests.DriverId
import org.springframework.stereotype.Service

@Service
class RaceService(private val driverService: DriverService) {

    suspend fun finishRace(race: Race) {
        race.results.forEach {
            val driversRaceResult = with(it) {
                DriversRaceResult(position, grid, laps, points, status)
            }
            val driversRace = with(race) {
                DriversRace(round, raceName, date, time, url, it.constructorId, driversRaceResult)
            }
            val driverId = DriverId(it.driverId)

            driverService.finishRace(RaceFinish(race.year, driverId, driversRace))
        }
    }
}