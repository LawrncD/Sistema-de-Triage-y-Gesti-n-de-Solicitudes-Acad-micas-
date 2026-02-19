package co.edu.uniquindio.poo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando se intenta una operación no permitida.
 * RF-08: Solicitud cerrada no puede ser modificada.
 * RF-13: Operaciones restringidas según rol.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class OperacionNoPermitidaException extends RuntimeException {

    public OperacionNoPermitidaException(String mensaje) {
        super(mensaje);
    }
}
