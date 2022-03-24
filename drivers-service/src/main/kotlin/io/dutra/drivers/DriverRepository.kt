package io.dutra.drivers

import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface DriverRepository: ReactiveMongoRepository<Driver, String> {
}