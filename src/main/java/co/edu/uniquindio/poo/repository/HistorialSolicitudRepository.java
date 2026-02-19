package co.edu.uniquindio.poo.repository;

import co.edu.uniquindio.poo.model.entity.HistorialSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad HistorialSolicitud.
 * RF-06: Acceso al historial auditable de cada solicitud.
 */
@Repository
public interface HistorialSolicitudRepository extends JpaRepository<HistorialSolicitud, Long> {

    /** Obtener historial ordenado por fecha de una solicitud */
    List<HistorialSolicitud> findBySolicitudIdOrderByFechaHoraAsc(Long solicitudId);

    /** Obtener historial por usuario que realizó la acción */
    List<HistorialSolicitud> findByUsuarioId(Long usuarioId);
}
