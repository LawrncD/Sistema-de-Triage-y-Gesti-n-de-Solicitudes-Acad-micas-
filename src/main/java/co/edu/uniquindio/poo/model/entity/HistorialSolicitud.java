package co.edu.uniquindio.poo.model.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

/**
 * Entidad que registra cada acción realizada sobre una solicitud.
 * RF-06: Historial auditable con fecha/hora, acción, usuario responsable y observaciones.
 */
@Entity
@Table(name = "historial_solicitudes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Solicitud a la que pertenece este registro de historial */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "solicitud_id", nullable = false)
    @JsonBackReference
    private Solicitud solicitud;

    /** Fecha y hora en que se realizó la acción */
    @Column(nullable = false)
    private LocalDateTime fechaHora;

    /** Descripción de la acción realizada */
    @Column(nullable = false, length = 300)
    private String accion;

    /** Usuario que realizó la acción */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /** Observaciones adicionales sobre la acción */
    @Column(length = 1000)
    private String observaciones;

    /**
     * Establece la fecha/hora antes de persistir si no se proporcionó.
     */
    @PrePersist
    protected void onCreate() {
        if (fechaHora == null) {
            fechaHora = LocalDateTime.now();
        }
    }
}
