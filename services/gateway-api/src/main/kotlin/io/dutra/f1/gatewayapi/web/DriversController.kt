package io.dutra.f1.gatewayapi.web

import org.springframework.beans.factory.annotation.Value
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody
import org.springframework.web.reactive.function.client.awaitExchange

@RestController
class DriversController(
    @Value("\${drivers-service.baseUrl}")
    private val baseUrl: String,
    @Value("\${drivers-service.get.uri}")
    private val getUri: String,
) {

    @QueryMapping
    suspend fun driver(@Argument id: String): Any {
        val webClient = WebClient.create(baseUrl)
        return webClient.get()
            .uri("${getUri}${id}")
            .awaitExchange { response ->
                response.awaitBody()
            }
    }
}