package io.dutra.f1.commons.model.aggregates

import javax.validation.constraints.Max
import javax.validation.constraints.Min

data class Race(
    @field:Min(value = 1950)
    @field:Max(value = 2050)
    val year: Int,
    @field:Min(value = 1)
    @field:Max(value = 25)
    val round: Int,
    val raceName: String,
    val date: String,
    val time: String,
    val url: String,
    val results: List<RaceResult>
)

data class RaceResult(
    @field:Min(value = 0)
    @field:Max(value = 26)
    val position: Int,
    @field:Min(value = 1)
    @field:Max(value = 26)
    val grid: Int,
    val laps: Int,
    val points: Float,
    val status: String,
    val driverId: String,
    val constructorId: String
)