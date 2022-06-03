package io.dutra.f1.drivers.model

import io.dutra.f1.drivers.model.aggregates.Driver
import io.dutra.f1.drivers.model.aggregates.DriversRace
import io.dutra.f1.drivers.model.aggregates.DriversRaceResult
import io.dutra.f1.drivers.web.requests.DriverId

val anyDriverId = DriverId("leclerc")

fun anyDriver() = Driver("leclerc",
        "LEC",
        "Charles Leclerc",
        "1997-10-16",
        "Monegasque",
        "https://en.wikipedia.org/wiki/Charles_Leclerc",
)

val anyDriversRaceResult = DriversRaceResult(1, 1, 50, 25f, "finished")

val anyDriversRace = DriversRace(1,
    "Interlagos",
    "2021-11-14",
    "15:00:00Z",
    "https://interlagos.com.br",
    "redbull",
    anyDriversRaceResult
)