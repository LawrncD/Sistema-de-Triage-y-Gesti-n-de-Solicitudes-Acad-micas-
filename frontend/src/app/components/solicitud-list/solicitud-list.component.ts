import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import {
  SolicitudResponse,
  EstadoSolicitud,
  TipoSolicitud,
  Prioridad,
  ESTADO_LABELS,
  PRIORIDAD_LABELS,
  TIPO_SOLICITUD_LABELS,
  CANAL_LABELS,
  CanalOrigen
} from '../../models';

@Component({
  selector: 'app-solicitud-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Solicitudes</h1>
        <a routerLink="/solicitudes/nueva" class="btn btn-primary">
          ➕ Nueva Solicitud
        </a>
      </div>

      <!-- Filters -->
      <div class="filters-card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Estado</label>
            <select [(ngModel)]="filtroEstado" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              @for (e of estados; track e) {
                <option [value]="e">{{ estadoLabel(e) }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label>Tipo</label>
            <select [(ngModel)]="filtroTipo" (change)="aplicarFiltros()">
              <option value="">Todos</option>
              @for (t of tipos; track t) {
                <option [value]="t">{{ tipoLabel(t) }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label>Prioridad</label>
            <select [(ngModel)]="filtroPrioridad" (change)="aplicarFiltros()">
              <option value="">Todas</option>
              @for (p of prioridades; track p) {
                <option [value]="p">{{ prioridadLabel(p) }}</option>
              }
            </select>
          </div>
          <button class="btn btn-outline" (click)="limpiarFiltros()">Limpiar</button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        @if (cargando) {
          <div class="loading">Cargando solicitudes...</div>
        } @else if (solicitudes.length === 0) {
          <div class="empty">No se encontraron solicitudes.</div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Canal</th>
                <th>Solicitante</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (s of solicitudes; track s.id) {
                <tr>
                  <td class="id-cell">#{{ s.id }}</td>
                  <td class="title-cell">{{ s.titulo }}</td>
                  <td>
                    <span class="badge badge-tipo">{{ tipoLabel(s.tipo) }}</span>
                  </td>
                  <td>
                    <span class="badge" [class]="'badge-' + s.estado.toLowerCase()">
                      {{ estadoLabel(s.estado) }}
                    </span>
                  </td>
                  <td>
                    @if (s.prioridad) {
                      <span class="badge" [class]="'badge-p-' + s.prioridad.toLowerCase()">
                        {{ prioridadLabel(s.prioridad) }}
                      </span>
                    } @else {
                      <span class="text-muted">—</span>
                    }
                  </td>
                  <td>{{ canalLabel(s.canalOrigen) }}</td>
                  <td>{{ s.solicitante.nombre }} {{ s.solicitante.apellido }}</td>
                  <td>{{ s.fechaCreacion | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <a [routerLink]="['/solicitudes', s.id]" class="btn-sm btn-view">Ver</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
        <div class="table-footer">
          Total: <strong>{{ solicitudes.length }}</strong> solicitudes
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 1.5rem; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a237e; }
    .btn {
      padding: 0.55rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #1a237e; color: #fff; }
    .btn-primary:hover { background: #283593; }
    .btn-outline {
      background: transparent;
      border: 2px solid #c5cae9;
      color: #1a237e;
      padding: 0.45rem 1rem;
    }
    .btn-outline:hover { border-color: #1a237e; background: #e8eaf6; }

    .filters-card {
      background: #fff;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      margin-bottom: 1rem;
    }
    .filters-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .filter-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .filter-group select {
      padding: 0.45rem 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
      background: #fff;
      min-width: 170px;
    }
    .filter-group select:focus { border-color: #1a237e; outline: none; }

    .table-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      background: #f5f5f5;
      color: #555;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
    }
    .data-table td {
      padding: 0.7rem 1rem;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.9rem;
    }
    .data-table tbody tr:hover { background: #f8f9ff; }
    .id-cell { font-weight: 700; color: #1a237e; }
    .title-cell { font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .badge-tipo { background: #f1f3f4; color: #555; }
    .badge-registrada { background: #e3f2fd; color: #1565c0; }
    .badge-clasificada { background: #f3e5f5; color: #7b1fa2; }
    .badge-en_atencion { background: #fff3e0; color: #e65100; }
    .badge-atendida { background: #e8f5e9; color: #2e7d32; }
    .badge-cerrada { background: #eceff1; color: #455a64; }
    .badge-p-baja { background: #e8f5e9; color: #2e7d32; }
    .badge-p-media { background: #e3f2fd; color: #1565c0; }
    .badge-p-alta { background: #fff3e0; color: #e65100; }
    .badge-p-critica { background: #ffebee; color: #c62828; }

    .btn-sm {
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-view { background: #e3f2fd; color: #1565c0; }
    .btn-view:hover { background: #bbdefb; }

    .table-footer {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #888;
      border-top: 1px solid #f0f0f0;
    }
    .loading, .empty {
      text-align: center; padding: 3rem; color: #999; font-style: italic;
    }
    .text-muted { color: #ccc; }

    @media (max-width: 900px) {
      .data-table { font-size: 0.8rem; }
      .data-table th, .data-table td { padding: 0.5rem; }
    }
  `]
})
export class SolicitudListComponent implements OnInit {
  solicitudes: SolicitudResponse[] = [];
  cargando = true;
  estados = Object.values(EstadoSolicitud);
  tipos = Object.values(TipoSolicitud);
  prioridades = Object.values(Prioridad);

  filtroEstado = '';
  filtroTipo = '';
  filtroPrioridad = '';

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.solicitudService.listarTodas().subscribe({
      next: res => {
        this.solicitudes = res.exito ? res.datos : [];
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  aplicarFiltros(): void {
    this.cargando = true;
    const filtros: any = {};
    if (this.filtroEstado) filtros.estado = this.filtroEstado;
    if (this.filtroTipo) filtros.tipo = this.filtroTipo;
    if (this.filtroPrioridad) filtros.prioridad = this.filtroPrioridad;

    this.solicitudService.listar(filtros).subscribe({
      next: res => {
        this.solicitudes = res.exito ? res.datos : [];
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroTipo = '';
    this.filtroPrioridad = '';
    this.cargar();
  }

  estadoLabel(e: EstadoSolicitud): string { return ESTADO_LABELS[e] || e; }
  tipoLabel(t: TipoSolicitud): string { return TIPO_SOLICITUD_LABELS[t] || t; }
  prioridadLabel(p: Prioridad): string { return PRIORIDAD_LABELS[p] || p; }
  canalLabel(c: CanalOrigen): string { return CANAL_LABELS[c] || c; }
}
