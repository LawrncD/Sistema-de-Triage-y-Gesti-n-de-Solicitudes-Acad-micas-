package co.edu.uniquindio.poo.controller;

import co.edu.uniquindio.poo.dto.common.ApiResponseDTO;
import co.edu.uniquindio.poo.dto.historial.HistorialResponseDTO;
import co.edu.uniquindio.poo.service.SolicitudService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial")
@Tag(name = "Historial", description = "Endpoints para consultar auditoría")
public class HistorialController {

    private final SolicitudService solicitudService;

    public HistorialController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @Operation(summary = "Obtener historial por solicitud")
    @GetMapping("/solicitud/{solicitudId}")
    public ResponseEntity<ApiResponseDTO<List<HistorialResponseDTO>>> obtenerHistorialPorSolicitud(@PathVariable Long solicitudId) {
        List<HistorialResponseDTO> response = solicitudService.obtenerHistorial(solicitudId);
        return ResponseEntity.ok(ApiResponseDTO.exitoso("Historial de la solicitud #" + solicitudId, response));
    }

    @Operation(summary = "Obtener historial por usuario (autor)")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ApiResponseDTO<List<HistorialResponseDTO>>> obtenerHistorialPorUsuario(@PathVariable Long usuarioId) {
        List<HistorialResponseDTO> response = solicitudService.obtenerHistorialPorUsuario(usuarioId);
        return ResponseEntity.ok(ApiResponseDTO.exitoso("Historial de acciones del usuario #" + usuarioId, response));
    }

    @Operation(summary = "Obtener historial completo (Auditoría Global)")
    @GetMapping("")
    public ResponseEntity<ApiResponseDTO<List<HistorialResponseDTO>>> obtenerTodosHistoriales() {
        List<HistorialResponseDTO> response = solicitudService.obtenerTodosHistoriales();
        return ResponseEntity.ok(ApiResponseDTO.exitoso("Auditoría global consultada", response));
    }
}
