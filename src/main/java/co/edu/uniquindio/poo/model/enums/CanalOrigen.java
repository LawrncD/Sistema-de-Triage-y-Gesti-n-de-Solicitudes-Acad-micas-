package co.edu.uniquindio.poo.model.enums;

/**
 * Canales de origen por los cuales puede ingresar una solicitud.
 * RF-01: Centralizar solicitudes provenientes de múltiples canales.
 */
public enum CanalOrigen {

    CSU("Centro de Servicios Universitarios"),
    CORREO("Correo electrónico"),
    SAC("Sistema Académico"),
    TELEFONICO("Telefónico"),
    PRESENCIAL("Atención presencial");

    private final String descripcion;

    CanalOrigen(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
