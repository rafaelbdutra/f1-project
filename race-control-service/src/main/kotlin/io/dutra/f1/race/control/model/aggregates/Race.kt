package io.dutra.f1.race.control.model.aggregates

data class Race(
    val season: String,
    val round: Int,
    val raceName: String,
    val date: String,
    val time: String,
    val url: String,
    val results: List<RaceResult>
)

data class RaceResult(
    val position: Int,
    val grid: Int,
    val laps: Int,
    val points: Double,
    val status: String,
    val driverId: String,
    val constructorId: String
)