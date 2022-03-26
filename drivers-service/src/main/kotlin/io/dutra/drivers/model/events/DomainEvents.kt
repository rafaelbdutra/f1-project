package io.dutra.drivers.model.events

import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Component
import java.time.LocalDateTime

abstract class DomainEvent<T>(open val domainObj: T, open val occurredOn: LocalDateTime)

abstract class DomainEventRegister<T> {

    @org.springframework.data.annotation.Transient
    private val domainEvents = mutableListOf<DomainEvent<T>>()

    fun domainEvents() = domainEvents

    fun register(domainEvent: DomainEvent<T>) = domainEvents.add(domainEvent)

    fun unregisterAll() = domainEvents.clear()
}

@Component
class DomainEventPublisher(val eventPublisher: ApplicationEventPublisher) {

    fun <T> publish(domainEventRegister: DomainEventRegister<T>) {
        with(domainEventRegister.domainEvents()) {
            forEach { eventPublisher.publishEvent(it) }
            domainEventRegister.unregisterAll()
        }
    }
}