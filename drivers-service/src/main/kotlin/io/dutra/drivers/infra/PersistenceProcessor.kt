package io.dutra.drivers.infra

import io.dutra.drivers.infra.repositories.DriverRepository
import io.dutra.drivers.model.events.DriverCreated
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class PersistenceProcessor(val driverRepository: DriverRepository) {

    @EventListener
    fun persistDriver(driverCreated: DriverCreated) =
        driverRepository.save(driverCreated.domainObj)
}