package io.dutra.f1.drivers.infra

import io.dutra.f1.drivers.infra.repositories.DriverRepository
import io.dutra.f1.drivers.model.aggregates.Driver
import io.dutra.f1.drivers.model.events.DriverCreated
import io.dutra.f1.drivers.model.events.DriverRaceFinished
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class PersistenceProcessor(val driverRepository: DriverRepository) {

    @EventListener
    fun persistDriver(driverCreated: DriverCreated): Mono<Driver> =
        driverRepository.save(driverCreated.domainObj)

    @EventListener
    fun driverFinishRace(driverRaceFinished: DriverRaceFinished): Mono<Driver> =
        driverRepository.save(driverRaceFinished.domainObj)
}