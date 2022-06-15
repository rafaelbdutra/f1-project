package io.dutra.f1.gatewayapi.web

import org.springframework.beans.factory.annotation.Value
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import javax.annotation.PostConstruct

@RestController
class DriversController(
    @Value("\${drivers-service.baseUrl}")
    private val baseUrl: String,
    @Value("\${drivers-service.get.uri}")
    private val getUri: String,
) {

    private lateinit var webClient: WebClient

    @PostConstruct
    fun createWebClient() {
        webClient = WebClient.create(baseUrl)
    }

    @QueryMapping
    suspend fun drivers() = webClient
        .get()
        .uri(getUri)
        .retrieve()
        .awaitBody<Any>()

    @QueryMapping
    suspend fun driver(@Argument id: String) = webClient
        .get()
        .uri("${getUri}/${id}")
        .retrieve()
        .awaitBody<Any>()
}