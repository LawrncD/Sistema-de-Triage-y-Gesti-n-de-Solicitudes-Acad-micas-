import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service';
import {
  SolicitudRequest,
  UsuarioResponse,
  CanalOrigen,
  CANAL_LABELS,
  Rol
} from '../../models';

@Component({
  selector: 'app-solicitud-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1 class="page-title">Nueva Solicitud</h1>

      <div class="form-card">
        @if (mensajeError) {
          <div class="alert alert-error">{{ mensajeError }}</div>
        }
        @if (mensajeExito) {
          <div class="alert alert-success">{{ mensajeExito }}</div>
        }

        <form (ngSubmit)="enviar()" #form="ngForm">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="titulo">Título *</label>
              <input id="titulo" type="text" [(ngModel)]="solicitud.titulo" name="titulo"
                required minlength="5" #titulo="ngModel"
                placeholder="Describe brevemente tu solicitud">
              @if (titulo.invalid && titulo.touched) {
                <span class="field-error">El título es obligatorio (mín. 5 caracteres)</span>
              }
            </div>

            <div class="form-group full-width">
              <label for="descripcion">Descripción *</label>
              <textarea id="descripcion" [(ngModel)]="solicitud.descripcion" name="descripcion"
                required minlength="10" #desc="ngModel" rows="4"
                placeholder="Detalla tu solicitud académica..."></textarea>
              @if (desc.invalid && desc.touched) {
                <span class="field-error">La descripción es obligatoria (mín. 10 caracteres)</span>
              }
            </div>

            <div class="form-group">
              <label for="canal">Canal de Origen *</label>
              <select id="canal" [(ngModel)]="solicitud.canalOrigen" name="canalOrigen" required>
                @for (c of canales; track c) {
                  <option [value]="c">{{ canalLabel(c) }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="solicitante">Solicitante *</label>
              <select id="solicitante" [(ngModel)]="solicitud.solicitanteId" name="solicitanteId" required>
                <option [ngValue]="0" disabled>Seleccione...</option>
                @for (u of usuarios; track u.id) {
                  <option [ngValue]="u.id">{{ u.nombre }} {{ u.apellido }} ({{ u.rol }})</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="fechaLimite">Fecha Límite (opcional)</label>
              <input id="fechaLimite" type="date" [(ngModel)]="solicitud.fechaLimite" name="fechaLimite">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="cancelar()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || enviando">
              {{ enviando ? 'Registrando...' : '📋 Registrar Solicitud' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a237e; margin-bottom: 1.25rem; }
    .form-card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .full-width { grid-column: 1 / -1; }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #444;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.6rem 0.85rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #1a237e;
      outline: none;
    }
    .form-group textarea { resize: vertical; }
    .field-error { color: #c62828; font-size: 0.8rem; }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
    }
    .btn {
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary { background: #1a237e; color: #fff; }
    .btn-primary:hover { background: #283593; }
    .btn-primary:disabled { background: #9fa8da; cursor: not-allowed; }
    .btn-outline {
      background: transparent;
      border: 2px solid #c5cae9;
      color: #1a237e;
    }
    .btn-outline:hover { border-color: #1a237e; background: #e8eaf6; }
    .alert {
      padding: 0.85rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
  `]
})
export class SolicitudCreateComponent implements OnInit {
  solicitud: SolicitudRequest = {
    titulo: '',
    descripcion: '',
    canalOrigen: CanalOrigen.CSU,
    solicitanteId: 0,
    fechaLimite: ''
  };

  usuarios: UsuarioResponse[] = [];
  canales = Object.values(CanalOrigen);
  enviando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.listarActivos().subscribe({
      next: res => { if (res.exito) this.usuarios = res.datos; },
      error: () => {}
    });
  }

  enviar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.enviando = true;

    const dto = { ...this.solicitud };
    if (!dto.fechaLimite) delete dto.fechaLimite;

    this.solicitudService.registrar(dto).subscribe({
      next: res => {
        this.enviando = false;
        if (res.exito) {
          this.mensajeExito = 'Solicitud registrada exitosamente';
          setTimeout(() => this.router.navigate(['/solicitudes', res.datos.id]), 1000);
        } else {
          this.mensajeError = res.mensaje;
        }
      },
      error: err => {
        this.enviando = false;
        this.mensajeError = err.error?.mensaje || 'Error al registrar la solicitud';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/solicitudes']);
  }

  canalLabel(c: CanalOrigen): string { return CANAL_LABELS[c] || c; }
}
