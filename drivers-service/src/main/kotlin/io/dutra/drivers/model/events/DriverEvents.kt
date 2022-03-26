package io.dutra.drivers.model.events

import io.dutra.drivers.model.aggregates.Driver
import java.time.LocalDateTime

data class DriverCreated(override val domainObj: Driver, override val occurredOn: LocalDateTime) :
    DomainEvent<Driver>(domainObj, occurredOn)