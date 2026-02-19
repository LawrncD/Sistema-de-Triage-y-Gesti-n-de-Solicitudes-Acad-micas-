package co.edu.uniquindio.poo.model.entity;

import co.edu.uniquindio.poo.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad que representa un usuario del sistema.
 * Puede ser un solicitante (estudiante) o un responsable (docente/administrativo).
 * RF-05: El responsable debe estar activo para poder ser asignado.
 * RF-13: Autorización básica según el rol del usuario.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String identificacion;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Column(length = 255)
    private String password;

    /**
     * Retorna el nombre completo del usuario.
     */
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
