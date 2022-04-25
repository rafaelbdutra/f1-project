package io.dutra.drivers

import io.dutra.drivers.model.aggregates.Race
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component

@Component
class RaceListener {

    @KafkaListener(topics = ["\${kafka.topics.race}"], properties = ["\${kafka.properties.type.race}"])
    fun listenRaceFinished(race: Race, ack: Acknowledgment) {
        println(">>>>> $race")
        ack.acknowledge()
    }
}