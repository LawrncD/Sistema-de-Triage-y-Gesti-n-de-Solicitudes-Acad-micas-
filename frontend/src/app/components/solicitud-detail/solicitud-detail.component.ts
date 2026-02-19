import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import {
  SolicitudResponse,
  UsuarioResponse,
  HistorialResponse,
  EstadoSolicitud,
  TipoSolicitud,
  Prioridad,
  Rol,
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  TIPO_SOLICITUD_LABELS,
  CANAL_LABELS,
  CanalOrigen
} from '../../models';

@Component({
  selector: 'app-solicitud-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      @if (cargando) {
        <div class="loading">Cargando solicitud...</div>
      } @else if (!solicitud) {
        <div class="empty">Solicitud no encontrada.</div>
      } @else {
        <!-- Header -->
        <div class="detail-header">
          <div>
            <a routerLink="/solicitudes" class="back-link">← Volver a solicitudes</a>
            <h1 class="page-title">#{{ solicitud.id }} — {{ solicitud.titulo }}</h1>
          </div>
          <div class="header-badges">
            <span class="badge badge-lg" [class]="'badge-' + solicitud.estado.toLowerCase()">
              {{ estadoLabel(solicitud.estado) }}
            </span>
            @if (solicitud.prioridad) {
              <span class="badge badge-lg" [class]="'badge-p-' + solicitud.prioridad.toLowerCase()">
                {{ prioridadLabel(solicitud.prioridad) }}
              </span>
            }
          </div>
        </div>

        @if (mensaje) {
          <div class="alert" [class.alert-success]="!esError" [class.alert-error]="esError">
            {{ mensaje }}
          </div>
        }

        <div class="detail-grid">
          <!-- Info Card -->
          <div class="card info-card">
            <h2>Información General</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Descripción</span>
                <span class="info-value desc">{{ solicitud.descripcion }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tipo</span>
                <span class="info-value">
                  @if (solicitud.tipo) {
                    {{ tipoLabel(solicitud.tipo) }}
                  } @else {
                    <em class="text-muted">Sin clasificar</em>
                  }
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Canal de Origen</span>
                <span class="info-value">{{ canalLabel(solicitud.canalOrigen) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Solicitante</span>
                <span class="info-value">{{ solicitud.solicitante.nombre }} {{ solicitud.solicitante.apellido }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Responsable</span>
                <span class="info-value">
                  @if (solicitud.responsable) {
                    {{ solicitud.responsable.nombre }} {{ solicitud.responsable.apellido }}
                  } @else {
                    <em class="text-muted">Sin asignar</em>
                  }
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Fecha Creación</span>
                <span class="info-value">{{ solicitud.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fecha Límite</span>
                <span class="info-value">
                  @if (solicitud.fechaLimite) {
                    {{ solicitud.fechaLimite | date:'dd/MM/yyyy' }}
                  } @else {
                    <em class="text-muted">No definida</em>
                  }
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Última Actualización</span>
                <span class="info-value">{{ solicitud.fechaUltimaActualizacion | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              @if (solicitud.observaciones) {
                <div class="info-item full">
                  <span class="info-label">Observaciones</span>
                  <span class="info-value desc">{{ solicitud.observaciones }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Actions Panel -->
          @if (solicitud.estado !== 'CERRADA') {
            <div class="card actions-card">
              <h2>Acciones</h2>

              <!-- RF-02: Clasificar -->
              @if (solicitud.estado === 'REGISTRADA') {
                <div class="action-section">
                  <h3>🏷️ Clasificar Solicitud (RF-02)</h3>
                  <div class="action-form">
                    <select [(ngModel)]="clasificarTipo" class="action-input">
                      @for (t of tipos; track t) {
                        <option [value]="t">{{ tipoLabel(t) }}</option>
                      }
                    </select>
                    <input type="text" [(ngModel)]="clasificarObs" placeholder="Observaciones..."
                      class="action-input">
                    <button class="btn btn-action" (click)="clasificar()">Clasificar</button>
                  </div>
                </div>
              }

              <!-- RF-03: Priorizar -->
              @if (solicitud.estado === 'CLASIFICADA' || solicitud.estado === 'REGISTRADA') {
                <div class="action-section">
                  <h3>📊 Priorizar Solicitud (RF-03)</h3>
                  <div class="action-form">
                    <select [(ngModel)]="priorizarPrioridad" class="action-input">
                      <option value="">Auto (por reglas)</option>
                      @for (p of prioridadesEnum; track p) {
                        <option [value]="p">{{ prioridadLabel(p) }}</option>
                      }
                    </select>
                    <button class="btn btn-action" (click)="priorizar()">Priorizar</button>
                  </div>
                </div>
              }

              <!-- RF-05: Asignar -->
              @if (!solicitud.responsable) {
                <div class="action-section">
                  <h3>👤 Asignar Responsable (RF-05)</h3>
                  <div class="action-form">
                    <select [(ngModel)]="asignarResponsableId" class="action-input">
                      <option [ngValue]="0" disabled>Seleccione responsable...</option>
                      @for (r of responsables; track r.id) {
                        <option [ngValue]="r.id">{{ r.nombre }} {{ r.apellido }}</option>
                      }
                    </select>
                    <input type="text" [(ngModel)]="asignarObs" placeholder="Observaciones..."
                      class="action-input">
                    <button class="btn btn-action" [disabled]="asignarResponsableId === 0"
                      (click)="asignar()">Asignar</button>
                  </div>
                </div>
              }

              <!-- RF-04: Cambiar estado -->
              <div class="action-section">
                <h3>🔄 Cambiar Estado (RF-04)</h3>
                <div class="action-form">
                  <select [(ngModel)]="nuevoEstado" class="action-input">
                    @for (e of estadosDisponibles; track e) {
                      <option [value]="e">{{ estadoLabel(e) }}</option>
                    }
                  </select>
                  <input type="text" [(ngModel)]="estadoObs" placeholder="Observaciones..."
                    class="action-input">
                  <button class="btn btn-action" (click)="cambiarEstado()">Cambiar</button>
                </div>
              </div>

              <!-- RF-08: Cerrar -->
              @if (solicitud.estado === 'ATENDIDA') {
                <div class="action-section cerrar">
                  <h3>🔒 Cerrar Solicitud (RF-08)</h3>
                  <div class="action-form">
                    <input type="text" [(ngModel)]="cerrarObs" placeholder="Observaciones de cierre *"
                      class="action-input" required>
                    <button class="btn btn-danger" [disabled]="!cerrarObs"
                      (click)="cerrar()">Cerrar Solicitud</button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- RF-06: Historial / Trazabilidad -->
          <div class="card historial-card full-width">
            <h2>📜 Historial de Trazabilidad (RF-06)</h2>
            @if (historial.length === 0) {
              <p class="text-muted">No hay registros de historial.</p>
            } @else {
              <div class="timeline">
                @for (h of historial; track h.id) {
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <strong>{{ h.accion }}</strong>
                        <span class="timeline-date">{{ h.fechaHora | date:'dd/MM/yyyy HH:mm:ss' }}</span>
                      </div>
                      @if (h.usuario) {
                        <div class="timeline-user">
                          Por: {{ h.usuario.nombre }} {{ h.usuario.apellido }}
                        </div>
                      }
                      @if (h.observaciones) {
                        <div class="timeline-obs">{{ h.observaciones }}</div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 1.5rem; }
    .loading, .empty { text-align: center; padding: 3rem; color: #999; font-style: italic; }
    .back-link {
      color: #1a237e;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .back-link:hover { text-decoration: underline; }
    .page-title { font-size: 1.4rem; font-weight: 700; color: #1a237e; margin: 0.25rem 0 0; }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    .header-badges { display: flex; gap: 0.5rem; }
    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .badge-lg { padding: 0.35rem 0.9rem; font-size: 0.85rem; }
    .badge-registrada { background: #e3f2fd; color: #1565c0; }
    .badge-clasificada { background: #f3e5f5; color: #7b1fa2; }
    .badge-en_atencion { background: #fff3e0; color: #e65100; }
    .badge-atendida { background: #e8f5e9; color: #2e7d32; }
    .badge-cerrada { background: #eceff1; color: #455a64; }
    .badge-p-baja { background: #e8f5e9; color: #2e7d32; }
    .badge-p-media { background: #e3f2fd; color: #1565c0; }
    .badge-p-alta { background: #fff3e0; color: #e65100; }
    .badge-p-critica { background: #ffebee; color: #c62828; }

    .alert {
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .full-width { grid-column: 1 / -1; }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card h2 {
      font-size: 1.05rem;
      color: #1a237e;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .info-grid .full { grid-column: 1 / -1; }
    .info-item { display: flex; flex-direction: column; gap: 0.15rem; }
    .info-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #888;
      font-weight: 600;
    }
    .info-value { font-size: 0.95rem; color: #333; }
    .info-value.desc {
      background: #f8f9fa;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .text-muted { color: #bbb; font-style: italic; }

    .action-section {
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      border: 1px solid #e8eaf6;
      border-radius: 8px;
      background: #fafbff;
    }
    .action-section.cerrar { border-color: #ffcdd2; background: #fff8f8; }
    .action-section h3 {
      font-size: 0.9rem;
      color: #333;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .action-form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }
    .action-input {
      padding: 0.45rem 0.65rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.85rem;
      min-width: 140px;
      flex: 1;
    }
    .action-input:focus { border-color: #1a237e; outline: none; }
    .btn {
      padding: 0.45rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-action { background: #1a237e; color: #fff; }
    .btn-action:hover { background: #283593; }
    .btn-action:disabled { background: #9fa8da; cursor: not-allowed; }
    .btn-danger { background: #c62828; color: #fff; }
    .btn-danger:hover { background: #b71c1c; }
    .btn-danger:disabled { background: #ef9a9a; cursor: not-allowed; }

    /* Timeline */
    .timeline { position: relative; padding-left: 1.5rem; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }
    .timeline-item {
      position: relative;
      margin-bottom: 1rem;
    }
    .timeline-dot {
      position: absolute;
      left: -1.5rem;
      top: 4px;
      width: 12px;
      height: 12px;
      background: #1a237e;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #c5cae9;
    }
    .timeline-content {
      padding: 0.5rem 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #f0f0f0;
    }
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;
      font-size: 0.9rem;
    }
    .timeline-date { font-size: 0.8rem; color: #999; }
    .timeline-user { font-size: 0.8rem; color: #666; }
    .timeline-obs {
      margin-top: 0.25rem;
      font-size: 0.85rem;
      color: #555;
      background: #fff;
      padding: 0.35rem 0.5rem;
      border-radius: 4px;
    }

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SolicitudDetailComponent implements OnInit {
  solicitud: SolicitudResponse | null = null;
  historial: HistorialResponse[] = [];
  responsables: UsuarioResponse[] = [];
  cargando = true;
  mensaje = '';
  esError = false;

  // Form models
  clasificarTipo: TipoSolicitud = TipoSolicitud.REGISTRO_ASIGNATURAS;
  clasificarObs = '';
  priorizarPrioridad = '';
  asignarResponsableId = 0;
  asignarObs = '';
  nuevoEstado: EstadoSolicitud = EstadoSolicitud.CLASIFICADA;
  estadoObs = '';
  cerrarObs = '';

  tipos = Object.values(TipoSolicitud);
  prioridadesEnum = Object.values(Prioridad);

  private solicitudId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.solicitudId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
    this.usuarioService.listarPorRol(Rol.RESPONSABLE).subscribe({
      next: res => { if (res.exito) this.responsables = res.datos; }
    });
  }

  cargar(): void {
    this.cargando = true;
    this.solicitudService.obtenerPorId(this.solicitudId).subscribe({
      next: res => {
        if (res.exito) {
          this.solicitud = res.datos;
          this.historial = res.datos.historial || [];
          this.actualizarEstadosDisponibles();
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  get estadosDisponibles(): EstadoSolicitud[] {
    if (!this.solicitud) return [];
    const transiciones: Record<string, EstadoSolicitud[]> = {
      'REGISTRADA': [EstadoSolicitud.CLASIFICADA],
      'CLASIFICADA': [EstadoSolicitud.EN_ATENCION],
      'EN_ATENCION': [EstadoSolicitud.ATENDIDA],
      'ATENDIDA': [EstadoSolicitud.CERRADA],
      'CERRADA': []
    };
    return transiciones[this.solicitud.estado] || [];
  }

  actualizarEstadosDisponibles(): void {
    const disponibles = this.estadosDisponibles;
    if (disponibles.length > 0) {
      this.nuevoEstado = disponibles[0];
    }
  }

  clasificar(): void {
    this.solicitudService.clasificar(this.solicitudId, {
      tipo: this.clasificarTipo,
      observaciones: this.clasificarObs || undefined
    }).subscribe({
      next: () => this.onSuccess('Solicitud clasificada correctamente'),
      error: err => this.onError(err)
    });
  }

  priorizar(): void {
    this.solicitudService.priorizar(this.solicitudId, {
      prioridad: this.priorizarPrioridad ? this.priorizarPrioridad as Prioridad : undefined
    }).subscribe({
      next: () => this.onSuccess('Solicitud priorizada correctamente'),
      error: err => this.onError(err)
    });
  }

  asignar(): void {
    this.solicitudService.asignar(this.solicitudId, {
      responsableId: this.asignarResponsableId,
      observaciones: this.asignarObs || undefined
    }).subscribe({
      next: () => this.onSuccess('Responsable asignado correctamente'),
      error: err => this.onError(err)
    });
  }

  cambiarEstado(): void {
    this.solicitudService.cambiarEstado(this.solicitudId, {
      nuevoEstado: this.nuevoEstado,
      observaciones: this.estadoObs || undefined
    }).subscribe({
      next: () => this.onSuccess('Estado cambiado correctamente'),
      error: err => this.onError(err)
    });
  }

  cerrar(): void {
    this.solicitudService.cerrar(this.solicitudId, {
      observaciones: this.cerrarObs
    }).subscribe({
      next: () => this.onSuccess('Solicitud cerrada correctamente'),
      error: err => this.onError(err)
    });
  }

  private onSuccess(msg: string): void {
    this.mensaje = msg;
    this.esError = false;
    this.cargar();
    setTimeout(() => this.mensaje = '', 4000);
  }

  private onError(err: any): void {
    this.mensaje = err.error?.mensaje || 'Error al procesar la operación';
    this.esError = true;
    setTimeout(() => this.mensaje = '', 5000);
  }

  estadoLabel(e: EstadoSolicitud): string { return ESTADO_LABELS[e] || e; }
  prioridadLabel(p: Prioridad): string { return PRIORIDAD_LABELS[p] || p; }
  tipoLabel(t: TipoSolicitud): string { return TIPO_SOLICITUD_LABELS[t] || t; }
  canalLabel(c: CanalOrigen): string { return CANAL_LABELS[c] || c; }
}
