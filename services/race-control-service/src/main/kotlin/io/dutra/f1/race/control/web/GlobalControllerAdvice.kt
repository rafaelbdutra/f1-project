package io.dutra.f1.race.control.web

import io.dutra.f1.commons.web.Error
import io.dutra.f1.commons.web.ErrorResponse
import org.springframework.http.HttpStatus
import org.springframework.validation.BindingResult
import org.springframework.validation.FieldError
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.support.WebExchangeBindException
import java.util.stream.Collectors

@ControllerAdvice
class GlobalControllerAdvice {

    companion object {
        const val DEFAULT_ERROR_MESSAGE = "Validation Error"
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    @ExceptionHandler(value = [WebExchangeBindException::class])
    fun handleException(ex: WebExchangeBindException): ErrorResponse =
        ErrorResponse(
            DEFAULT_ERROR_MESSAGE,
            HttpStatus.BAD_REQUEST.value(),
            getErrors(ex.bindingResult),
            null
        )


    private fun getErrors(result: BindingResult): List<Error> {
        return result.allErrors.stream().map {
            Error(
                it.defaultMessage ?: "",
                it.objectName,
                if (it is FieldError) it.field else null
            )
        }.collect(Collectors.toList())
    }
}
