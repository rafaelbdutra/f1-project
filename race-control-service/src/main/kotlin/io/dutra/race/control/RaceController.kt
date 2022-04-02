package io.dutra.race.control

import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/race")
class RaceController(
    private val kafkaTemplate: KafkaTemplate<String, Any>,
    @Value("\${kafka.topics.race}") val topic: String,
) {

    @PostMapping
    fun test(@RequestParam message: String) =
        kafkaTemplate.send(topic, message)
}