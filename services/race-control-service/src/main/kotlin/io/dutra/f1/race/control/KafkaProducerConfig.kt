package io.dutra.f1.race.control

import io.dutra.f1.commons.infra.ConditionalOnKafkaEnabled
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnKafkaEnabled
class KafkaProducerConfig(
    @Value("\${kafka.topics.race}")
    private val topic: String,
) {

    @Bean
    fun race(): NewTopic {
        return NewTopic(topic, 1, 1.toShort())
    }
}