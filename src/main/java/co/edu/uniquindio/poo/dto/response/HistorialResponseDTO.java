package co.edu.uniquindio.poo.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO de respuesta con una entrada del historial de una solicitud.
 * RF-06: Información auditable de cada acción.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialResponseDTO {

    private Long id;
    private LocalDateTime fechaHora;
    private String accion;
    private String nombreUsuario;
    private String observaciones;
}
