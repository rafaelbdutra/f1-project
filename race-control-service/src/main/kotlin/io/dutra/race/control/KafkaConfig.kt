package io.dutra.race.control

import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaAdmin
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.support.serializer.JsonSerializer

@Configuration
class KafkaConfig(
    @Value("\${kafka.bootstrapAddress}")
    private val servers: String,
    @Value("\${kafka.topics.race}")
    private val topic: String,
) {
    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        val configProps = mutableMapOf<String, Any>()
        configProps[AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG] = servers
        return KafkaAdmin(configProps)
    }

    @Bean
    fun race(): NewTopic {
        return NewTopic(topic, 1, 1.toShort())
    }

    @Bean
    fun producerFactory(): ProducerFactory<String, Any> {
        val configProps = mutableMapOf<String, Any>()
        configProps[ProducerConfig.BOOTSTRAP_SERVERS_CONFIG] = servers
        configProps[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = StringSerializer::class.java
        configProps[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = JsonSerializer::class.java
        return DefaultKafkaProducerFactory(configProps)
    }

    @Bean
    fun kafkaTemplate(producerFactory: ProducerFactory<String, Any>): KafkaTemplate<String, Any> {
        return KafkaTemplate(producerFactory)
    }
}