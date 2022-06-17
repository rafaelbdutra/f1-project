package io.dutra.f1.commons.infra

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty

@ConditionalOnProperty(
    prefix = "kafka",
    name = ["enabled"],
    havingValue = "true",
    matchIfMissing = false,
)
annotation class ConditionalOnKafkaEnabled {}