import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import {
  SolicitudResponse,
  EstadoSolicitud,
  Prioridad,
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  TIPO_SOLICITUD_LABELS
} from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1 class="page-title">Dashboard</h1>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card registrada">
          <div class="stat-number">{{ contarPorEstado('REGISTRADA') }}</div>
          <div class="stat-label">Registradas</div>
          <div class="stat-icon">📥</div>
        </div>
        <div class="stat-card clasificada">
          <div class="stat-number">{{ contarPorEstado('CLASIFICADA') }}</div>
          <div class="stat-label">Clasificadas</div>
          <div class="stat-icon">🏷️</div>
        </div>
        <div class="stat-card en-atencion">
          <div class="stat-number">{{ contarPorEstado('EN_ATENCION') }}</div>
          <div class="stat-label">En Atención</div>
          <div class="stat-icon">⚙️</div>
        </div>
        <div class="stat-card atendida">
          <div class="stat-number">{{ contarPorEstado('ATENDIDA') }}</div>
          <div class="stat-label">Atendidas</div>
          <div class="stat-icon">✅</div>
        </div>
        <div class="stat-card cerrada">
          <div class="stat-number">{{ contarPorEstado('CERRADA') }}</div>
          <div class="stat-label">Cerradas</div>
          <div class="stat-icon">🔒</div>
        </div>
      </div>

      <!-- Priority Summary -->
      <div class="section-row">
        <div class="card priority-card">
          <h2>Distribución por Prioridad</h2>
          <div class="priority-bars">
            @for (p of prioridades; track p) {
              <div class="priority-row">
                <span class="priority-label badge" [class]="'badge-' + p.toLowerCase()">{{ prioridadLabel(p) }}</span>
                <div class="bar-wrapper">
                  <div class="bar" [class]="'bar-' + p.toLowerCase()"
                    [style.width.%]="getBarWidth(p)">
                  </div>
                </div>
                <span class="priority-count">{{ contarPorPrioridad(p) }}</span>
              </div>
            }
          </div>
        </div>

        <div class="card recent-card">
          <h2>Solicitudes Recientes</h2>
          @if (solicitudes.length === 0) {
            <p class="empty-msg">No hay solicitudes registradas.</p>
          }
          @for (s of ultimasSolicitudes; track s.id) {
            <a [routerLink]="['/solicitudes', s.id]" class="recent-item">
              <div class="recent-header">
                <span class="recent-title">{{ s.titulo }}</span>
                <span class="badge" [class]="'badge-' + s.estado.toLowerCase()">
                  {{ estadoLabel(s.estado) }}
                </span>
              </div>
              <div class="recent-meta">
                <span>{{ tipoLabel(s.tipo) }}</span>
                <span>{{ s.solicitante.nombre }} {{ s.solicitante.apellido }}</span>
                <span>{{ s.fechaCreacion | date:'short' }}</span>
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1.5rem; }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
      margin-bottom: 1.5rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }
    .stat-card.registrada::before { background: #42a5f5; }
    .stat-card.clasificada::before { background: #ab47bc; }
    .stat-card.en-atencion::before { background: #ffa726; }
    .stat-card.atendida::before { background: #66bb6a; }
    .stat-card.cerrada::before { background: #78909c; }
    .stat-number { font-size: 2rem; font-weight: 800; color: #1a237e; }
    .stat-label { font-size: 0.85rem; color: #666; margin-top: 0.25rem; }
    .stat-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      opacity: 0.5;
    }
    .section-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card h2 {
      font-size: 1.1rem;
      color: #1a237e;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .priority-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .priority-label { width: 70px; text-align: center; font-size: 0.8rem; }
    .bar-wrapper {
      flex: 1;
      background: #f1f3f4;
      border-radius: 6px;
      height: 22px;
      overflow: hidden;
    }
    .bar {
      height: 100%;
      border-radius: 6px;
      transition: width 0.6s ease;
      min-width: 2px;
    }
    .bar-baja { background: #66bb6a; }
    .bar-media { background: #42a5f5; }
    .bar-alta { background: #ffa726; }
    .bar-critica { background: #ef5350; }
    .priority-count { font-weight: 600; color: #333; min-width: 24px; text-align: right; }

    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .badge-registrada { background: #e3f2fd; color: #1565c0; }
    .badge-clasificada { background: #f3e5f5; color: #7b1fa2; }
    .badge-en_atencion { background: #fff3e0; color: #e65100; }
    .badge-atendida { background: #e8f5e9; color: #2e7d32; }
    .badge-cerrada { background: #eceff1; color: #455a64; }
    .badge-baja { background: #e8f5e9; color: #2e7d32; }
    .badge-media { background: #e3f2fd; color: #1565c0; }
    .badge-alta { background: #fff3e0; color: #e65100; }
    .badge-critica { background: #ffebee; color: #c62828; }

    .recent-item {
      display: block;
      padding: 0.75rem;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      border: 1px solid #f1f3f4;
      margin-bottom: 0.5rem;
      transition: all 0.2s;
    }
    .recent-item:hover {
      border-color: #c5cae9;
      background: #f8f9ff;
    }
    .recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .recent-title { font-weight: 600; font-size: 0.9rem; }
    .recent-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: #888;
    }
    .empty-msg { color: #999; font-style: italic; text-align: center; padding: 2rem; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(3, 1fr); }
      .section-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  solicitudes: SolicitudResponse[] = [];
  prioridades = Object.values(Prioridad);

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.solicitudService.listarTodas().subscribe({
      next: res => { if (res.exito) this.solicitudes = res.datos; },
      error: () => {}
    });
  }

  contarPorEstado(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  contarPorPrioridad(prioridad: string): number {
    return this.solicitudes.filter(s => s.prioridad === prioridad).length;
  }

  getBarWidth(prioridad: string): number {
    const total = this.solicitudes.length || 1;
    return (this.contarPorPrioridad(prioridad) / total) * 100;
  }

  get ultimasSolicitudes(): SolicitudResponse[] {
    return [...this.solicitudes]
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 5);
  }

  estadoLabel(e: EstadoSolicitud): string { return ESTADO_LABELS[e] || e; }
  prioridadLabel(p: string): string { return PRIORIDAD_LABELS[p as Prioridad] || p; }
  tipoLabel(t: any): string { return TIPO_SOLICITUD_LABELS[t as keyof typeof TIPO_SOLICITUD_LABELS] || t; }
}
