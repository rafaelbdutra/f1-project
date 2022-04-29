package io.dutra.f1.drivers.web.services

import io.dutra.f1.commons.model.aggregates.Race
import io.dutra.f1.drivers.model.aggregates.DriverRace
import io.dutra.f1.drivers.model.aggregates.DriverRaceResult
import io.dutra.f1.drivers.web.requests.DriverId
import org.springframework.stereotype.Service

@Service
class RaceService(private val driverService: DriverService) {

    suspend fun finishRace(race: Race) {
        race.results.forEach {
            val driverRaceResult = with(it) {
                DriverRaceResult(position, grid, laps, points, status)
            }
            val driverRace = with(race) {
                DriverRace(round, raceName, date, time, url, it.constructorId, driverRaceResult)
            }
            val driverId = DriverId(it.driverId)

            driverService.finishRace(RaceFinish(race.year, driverId, driverRace))
        }
    }
}