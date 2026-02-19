package co.edu.uniquindio.poo.model.enums;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests para las transiciones de estado del ciclo de vida de la solicitud.
 * RF-04: Validación de transiciones coherentes.
 */
class EstadoSolicitudTest {

    @Test
    @DisplayName("RF-04: REGISTRADA puede transicionar a CLASIFICADA")
    void registradaPuedeIrAClasificada() {
        assertTrue(EstadoSolicitud.REGISTRADA.puedeTransicionarA(EstadoSolicitud.CLASIFICADA));
    }

    @Test
    @DisplayName("RF-04: CLASIFICADA puede transicionar a EN_ATENCION")
    void clasificadaPuedeIrAEnAtencion() {
        assertTrue(EstadoSolicitud.CLASIFICADA.puedeTransicionarA(EstadoSolicitud.EN_ATENCION));
    }

    @Test
    @DisplayName("RF-04: EN_ATENCION puede transicionar a ATENDIDA")
    void enAtencionPuedeIrAAtendida() {
        assertTrue(EstadoSolicitud.EN_ATENCION.puedeTransicionarA(EstadoSolicitud.ATENDIDA));
    }

    @Test
    @DisplayName("RF-04: ATENDIDA puede transicionar a CERRADA")
    void atendidaPuedeIrACerrada() {
        assertTrue(EstadoSolicitud.ATENDIDA.puedeTransicionarA(EstadoSolicitud.CERRADA));
    }

    @Test
    @DisplayName("RF-04: REGISTRADA NO puede saltar a EN_ATENCION")
    void registradaNoPuedeSaltarAEnAtencion() {
        assertFalse(EstadoSolicitud.REGISTRADA.puedeTransicionarA(EstadoSolicitud.EN_ATENCION));
    }

    @Test
    @DisplayName("RF-04: REGISTRADA NO puede ir directamente a CERRADA")
    void registradaNoPuedeIrACerrada() {
        assertFalse(EstadoSolicitud.REGISTRADA.puedeTransicionarA(EstadoSolicitud.CERRADA));
    }

    @Test
    @DisplayName("RF-04: CERRADA no permite ninguna transición (estado final)")
    void cerradaNoPermiteTransiciones() {
        assertFalse(EstadoSolicitud.CERRADA.puedeTransicionarA(EstadoSolicitud.REGISTRADA));
        assertFalse(EstadoSolicitud.CERRADA.puedeTransicionarA(EstadoSolicitud.CLASIFICADA));
        assertFalse(EstadoSolicitud.CERRADA.puedeTransicionarA(EstadoSolicitud.EN_ATENCION));
        assertFalse(EstadoSolicitud.CERRADA.puedeTransicionarA(EstadoSolicitud.ATENDIDA));
        assertFalse(EstadoSolicitud.CERRADA.puedeTransicionarA(EstadoSolicitud.CERRADA));
    }

    @Test
    @DisplayName("RF-04: No se puede retroceder de CLASIFICADA a REGISTRADA")
    void noPuedeRetrocederDeClasificadaARegistrada() {
        assertFalse(EstadoSolicitud.CLASIFICADA.puedeTransicionarA(EstadoSolicitud.REGISTRADA));
    }

    @Test
    @DisplayName("RF-04: No se puede retroceder de ATENDIDA a EN_ATENCION")
    void noPuedeRetrocederDeAtendidaAEnAtencion() {
        assertFalse(EstadoSolicitud.ATENDIDA.puedeTransicionarA(EstadoSolicitud.EN_ATENCION));
    }
}
