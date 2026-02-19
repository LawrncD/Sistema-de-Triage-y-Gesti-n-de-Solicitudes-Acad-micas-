package co.edu.uniquindio.poo.model.enums;

/**
 * Niveles de prioridad asignables a una solicitud.
 * RF-03: Priorización de solicitudes basada en reglas de negocio.
 */
public enum Prioridad {

    BAJA("Baja", 1),
    MEDIA("Media", 2),
    ALTA("Alta", 3),
    CRITICA("Crítica", 4);

    private final String descripcion;
    private final int nivel;

    Prioridad(String descripcion, int nivel) {
        this.descripcion = descripcion;
        this.nivel = nivel;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getNivel() {
        return nivel;
    }
}
