package io.dutra.f1.drivers.model.aggregates

data class DriversRace(
    val round: Int,
    val raceName: String,
    val date: String,
    val time: String,
    val url: String,
    val constructorId: String,
    val result: DriversRaceResult,
)

data class DriversRaceResult(
    val position: Int,
    val grid: Int,
    val laps: Int,
    val points: Float,
    val status: String,
)