package co.edu.uniquindio.poo.dto.request;

import co.edu.uniquindio.poo.model.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO para registrar o actualizar un usuario en el sistema.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRequestDTO {

    @NotBlank(message = "La identificación es obligatoria")
    private String identificacion;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
