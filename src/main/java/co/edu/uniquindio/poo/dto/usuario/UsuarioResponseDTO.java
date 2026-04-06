package co.edu.uniquindio.poo.dto.usuario;

import co.edu.uniquindio.poo.model.enums.Rol;
import lombok.*;

/**
 * DTO de respuesta con la información de un usuario.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;
    private String identificacion;
    private String nombre;
    private String apellido;
    private String nombreCompleto;
    private String email;
    private Rol rol;
    private Boolean activo;
}
