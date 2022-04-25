package io.dutra.f1.drivers

import io.dutra.f1.drivers.model.aggregates.Race
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