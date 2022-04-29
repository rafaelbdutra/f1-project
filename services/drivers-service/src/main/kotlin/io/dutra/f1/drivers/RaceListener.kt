package io.dutra.f1.drivers

import io.dutra.f1.commons.model.aggregates.Race
import io.dutra.f1.drivers.web.services.RaceService
import kotlinx.coroutines.runBlocking
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component

@Component
class RaceListener(private val raceService: RaceService) {

    @KafkaListener(topics = ["\${kafka.topics.race}"], properties = ["\${kafka.properties.type.race}"])
    fun listenRaceFinished(race: Race, ack: Acknowledgment) {
        runBlocking {
            println(">>>>> $race")
            raceService.finishRace(race)
            ack.acknowledge()
        }
    }
}