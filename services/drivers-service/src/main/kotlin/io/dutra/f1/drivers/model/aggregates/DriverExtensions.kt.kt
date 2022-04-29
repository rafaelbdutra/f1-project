package io.dutra.f1.drivers.model.aggregates

fun Driver.seasonByYear(year: Int): Season? =
    seasons.find { it.year == year }