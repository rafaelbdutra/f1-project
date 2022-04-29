package io.dutra.f1.race.control.web

import io.dutra.f1.commons.model.aggregates.Race
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.support.MessageBuilder
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/race")
class RaceController(
    private val kafkaTemplate: KafkaTemplate<String, Any>,
    @Value("\${kafka.topics.race}") val topic: String,
) {

    @PostMapping(consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun finishRace(@Validated @RequestBody race: Race) {
        val message = MessageBuilder
            .withPayload(race)
            .setHeader(KafkaHeaders.TOPIC, topic)
            .build()
        kafkaTemplate.send(message)
    }
}