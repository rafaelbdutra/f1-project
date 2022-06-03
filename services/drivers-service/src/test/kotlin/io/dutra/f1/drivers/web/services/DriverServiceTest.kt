package io.dutra.f1.drivers.web.services

import assertk.assertThat
import assertk.assertions.isEmpty
import assertk.assertions.isEqualTo
import io.dutra.f1.drivers.infra.repositories.DriverRepository
import io.dutra.f1.drivers.model.aggregates.DriversRace
import io.dutra.f1.drivers.model.aggregates.Season
import io.dutra.f1.drivers.model.anyDriver
import io.dutra.f1.drivers.model.anyDriverId
import io.dutra.f1.drivers.model.anyDriversRace
import io.dutra.f1.drivers.model.anyDriversRaceResult
import io.dutra.f1.drivers.model.events.DomainEventPublisher
import io.dutra.f1.drivers.model.events.DomainEventRegister
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.impl.annotations.RelaxedMockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import reactor.core.publisher.Mono

@ExtendWith(MockKExtension::class)
internal class DriverServiceTest {

    @MockK
    private lateinit var driverRepository: DriverRepository

    @RelaxedMockK
    private lateinit var eventPublisher: DomainEventPublisher

    private lateinit var driverService: DriverService

    @BeforeEach
    fun setUp() {
        driverService = DriverService(driverRepository, eventPublisher)
    }

    @Test
    fun `driver should finish first race ever - no seasons`() {
        val driver = anyDriver()
        every { driverRepository.findById(driver.id) } returns Mono.just(driver)
        val raceFinish = RaceFinish(2022, anyDriverId, anyDriversRace)

        runBlocking {
            assertThat(driver.seasons).isEmpty()
            val checkedFlagDriver = driverService.finishRace(raceFinish)
            assertThat(checkedFlagDriver.seasons.size).isEqualTo(1)

            verify { driverRepository.findById(driver.id) }
            verify { eventPublisher.publish<DomainEventRegister<Any>>(any()) }
        }
    }

    @Test
    fun `driver should finish another race for same season`() {
        val driver = anyDriver()
        val season2022 = Season(2022, mutableListOf(anyDriversRace))
        driver.seasons.add(season2022)

        every { driverRepository.findById(driver.id) } returns Mono.just(driver)
        val secondDriversRace =
            DriversRace(2, "Test", "2022-01-01", "15:00:00Z", "https://test.io", "redbull", anyDriversRaceResult)
        val raceFinish = RaceFinish(2022, anyDriverId, secondDriversRace)

        runBlocking {
            val checkedFlagDriver = driverService.finishRace(raceFinish)
            assertThat(checkedFlagDriver.seasons.size).isEqualTo(1)

            verify { driverRepository.findById(driver.id) }
            verify { eventPublisher.publish<DomainEventRegister<Any>>(any()) }
        }
    }
}