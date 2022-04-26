package io.dutra.f1.drivers.web.services

import io.dutra.f1.drivers.infra.repositories.DriverRepository
import io.dutra.f1.drivers.model.aggregates.Driver
import io.dutra.f1.drivers.model.events.DomainEventPublisher
import io.dutra.f1.drivers.web.requests.CreateDriverRequest
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class DriverService(
    private val driverRepository: DriverRepository,
    private val domainEventPublisher: DomainEventPublisher,
) {

    fun list(): Flow<Driver> =
        driverRepository.findAll().asFlow()

    suspend fun create(createDriverRequest: CreateDriverRequest): Driver {
        val dbDriver = driverRepository.findById(createDriverRequest.id).awaitSingleOrNull()
        check(dbDriver == null) { "Driver already exists" }

        val driver = with(createDriverRequest) { Driver(id, code, name, dob, nationality, url) }
        domainEventPublisher.publish(driver.create())
        return driver
    }
}