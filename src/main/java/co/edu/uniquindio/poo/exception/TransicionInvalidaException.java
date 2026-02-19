package co.edu.uniquindio.poo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando se intenta una transición de estado inválida.
 * RF-04: Las transiciones entre estados deben ser coherentes.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TransicionInvalidaException extends RuntimeException {

    public TransicionInvalidaException(String mensaje) {
        super(mensaje);
    }

    public TransicionInvalidaException(String estadoActual, String estadoDestino) {
        super(String.format("Transición inválida: no se puede pasar de '%s' a '%s'", estadoActual, estadoDestino));
    }
}
