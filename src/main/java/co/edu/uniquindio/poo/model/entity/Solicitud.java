package co.edu.uniquindio.poo.model.entity;

import co.edu.uniquindio.poo.model.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad principal que representa una solicitud académica.
 * 
 * RF-01: Almacena tipo, descripción, canal de origen, fecha/hora y solicitante.
 * RF-02: Clasificación según tipo de solicitud.
 * RF-03: Priorización con justificación.
 * RF-04: Gestión del ciclo de vida (Registrada → Clasificada → En atención → Atendida → Cerrada).
 * RF-05: Asignación de responsable.
 * RF-08: Cierre con observación, solicitud cerrada no se modifica.
 */
@Entity
@Table(name = "solicitudes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** RF-02: Tipo de solicitud (Registro, Homologación, Cancelación, etc.) */
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TipoSolicitud tipoSolicitud;

    /** RF-01: Descripción detallada de la solicitud */
    @Column(nullable = false, length = 2000)
    private String descripcion;

    /** RF-01: Canal por el que ingresó la solicitud */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CanalOrigen canalOrigen;

    /** RF-01: Fecha y hora de registro automática */
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    /** RF-01: Usuario que realiza la solicitud */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Usuario solicitante;

    /** RF-04: Estado actual dentro del ciclo de vida */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoSolicitud estado;

    /** RF-03: Prioridad asignada según reglas de negocio */
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Prioridad prioridad;

    /** RF-03: Justificación de la prioridad asignada */
    @Column(length = 500)
    private String justificacionPrioridad;

    /** RF-05: Responsable asignado para atender la solicitud */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "responsable_id")
    private Usuario responsable;

    /** RF-03: Fecha límite asociada (factor de priorización) */
    private LocalDate fechaLimite;

    /** RF-08: Observación registrada al cerrar la solicitud */
    @Column(length = 1000)
    private String observacionCierre;

    /** RF-06: Historial auditable de acciones sobre la solicitud */
    @OneToMany(mappedBy = "solicitud", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("fechaHora ASC")
    @Builder.Default
    private List<HistorialSolicitud> historial = new ArrayList<>();

    /**
     * Establece valores por defecto antes de persistir.
     */
    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoSolicitud.REGISTRADA;
        }
    }

    /**
     * Agrega una entrada al historial de la solicitud.
     */
    public void agregarHistorial(HistorialSolicitud entrada) {
        historial.add(entrada);
        entrada.setSolicitud(this);
    }
}
