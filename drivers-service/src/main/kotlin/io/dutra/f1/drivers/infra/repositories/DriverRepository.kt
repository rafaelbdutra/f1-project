package io.dutra.f1.drivers.infra.repositories

import io.dutra.f1.drivers.model.aggregates.Driver
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface DriverRepository: ReactiveMongoRepository<Driver, String> {
}