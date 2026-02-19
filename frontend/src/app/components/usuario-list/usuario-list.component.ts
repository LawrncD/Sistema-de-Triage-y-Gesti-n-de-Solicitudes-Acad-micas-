import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import {
  UsuarioResponse,
  UsuarioRequest,
  Rol,
  ROL_LABELS
} from '../../models';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Usuarios</h1>
        <button class="btn btn-primary" (click)="mostrarFormulario = !mostrarFormulario">
          {{ mostrarFormulario ? '✕ Cerrar' : '➕ Nuevo Usuario' }}
        </button>
      </div>

      @if (mensaje) {
        <div class="alert" [class.alert-success]="!esError" [class.alert-error]="esError">
          {{ mensaje }}
        </div>
      }

      <!-- Create Form -->
      @if (mostrarFormulario) {
        <div class="form-card">
          <h2>{{ editandoId ? 'Editar' : 'Nuevo' }} Usuario</h2>
          <form (ngSubmit)="guardar()" #form="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Identificación *</label>
                <input type="text" [(ngModel)]="formUsuario.identificacion" name="identificacion"
                  required placeholder="Ej: 1234567890">
              </div>
              <div class="form-group">
                <label>Nombre *</label>
                <input type="text" [(ngModel)]="formUsuario.nombre" name="nombre"
                  required placeholder="Nombre">
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input type="text" [(ngModel)]="formUsuario.apellido" name="apellido"
                  required placeholder="Apellido">
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" [(ngModel)]="formUsuario.email" name="email"
                  required placeholder="correo@ejemplo.com">
              </div>
              <div class="form-group">
                <label>Rol *</label>
                <select [(ngModel)]="formUsuario.rol" name="rol" required>
                  @for (r of roles; track r) {
                    <option [value]="r">{{ rolLabel(r) }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Contraseña *</label>
                <input type="password" [(ngModel)]="formUsuario.password" name="password"
                  required minlength="4" placeholder="Contraseña">
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="cancelarForm()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
                {{ editandoId ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Users Table -->
      <div class="table-card">
        @if (cargando) {
          <div class="loading">Cargando usuarios...</div>
        } @else if (usuarios.length === 0) {
          <div class="empty">No hay usuarios registrados.</div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (u of usuarios; track u.id) {
                <tr [class.inactive-row]="!u.activo">
                  <td class="id-cell">#{{ u.id }}</td>
                  <td>{{ u.identificacion }}</td>
                  <td class="name-cell">{{ u.nombre }} {{ u.apellido }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <span class="badge" [class]="'badge-' + u.rol.toLowerCase()">
                      {{ rolLabel(u.rol) }}
                    </span>
                  </td>
                  <td>
                    <span class="status-dot" [class.active]="u.activo" [class.inactive]="!u.activo"></span>
                    {{ u.activo ? 'Activo' : 'Inactivo' }}
                  </td>
                  <td class="actions-cell">
                    <button class="btn-sm btn-edit" (click)="editar(u)">✏️</button>
                    @if (u.activo) {
                      <button class="btn-sm btn-deactivate" (click)="desactivar(u.id)">🚫</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
        <div class="table-footer">
          Total: <strong>{{ usuarios.length }}</strong> usuarios
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

    .form-card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      margin-bottom: 1.25rem;
    }
    .form-card h2 { font-size: 1.1rem; color: #1a237e; margin-bottom: 1rem; font-weight: 600; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #444; }
    .form-group input,
    .form-group select {
      padding: 0.5rem 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .form-group input:focus, .form-group select:focus { border-color: #1a237e; outline: none; }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

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
      padding: 0.65rem 1rem;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.9rem;
    }
    .data-table tbody tr:hover { background: #f8f9ff; }
    .inactive-row { opacity: 0.5; }
    .id-cell { font-weight: 700; color: #1a237e; }
    .name-cell { font-weight: 500; }

    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .badge-estudiante { background: #e3f2fd; color: #1565c0; }
    .badge-docente { background: #f3e5f5; color: #7b1fa2; }
    .badge-administrativo { background: #fff3e0; color: #e65100; }
    .badge-responsable { background: #e8f5e9; color: #2e7d32; }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 0.35rem;
    }
    .status-dot.active { background: #66bb6a; }
    .status-dot.inactive { background: #ef5350; }

    .actions-cell { display: flex; gap: 0.35rem; }
    .btn-sm {
      padding: 0.3rem 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
      background: #f5f5f5;
    }
    .btn-sm:hover { background: #e0e0e0; }
    .btn-edit:hover { background: #e3f2fd; }
    .btn-deactivate:hover { background: #ffebee; }

    .table-footer {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      color: #888;
      border-top: 1px solid #f0f0f0;
    }
    .loading, .empty { text-align: center; padding: 3rem; color: #999; font-style: italic; }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  cargando = true;
  mostrarFormulario = false;
  editandoId: number | null = null;
  mensaje = '';
  esError = false;
  roles = Object.values(Rol);

  formUsuario: UsuarioRequest = {
    identificacion: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: Rol.ESTUDIANTE,
    password: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.usuarioService.listarTodos().subscribe({
      next: res => {
        this.usuarios = res.exito ? res.datos : [];
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  guardar(): void {
    const obs = this.editandoId
      ? this.usuarioService.actualizar(this.editandoId, this.formUsuario)
      : this.usuarioService.crear(this.formUsuario);

    obs.subscribe({
      next: res => {
        if (res.exito) {
          this.show(this.editandoId ? 'Usuario actualizado' : 'Usuario creado exitosamente', false);
          this.cancelarForm();
          this.cargar();
        }
      },
      error: err => this.show(err.error?.mensaje || 'Error al guardar', true)
    });
  }

  editar(u: UsuarioResponse): void {
    this.editandoId = u.id;
    this.formUsuario = {
      identificacion: u.identificacion,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      rol: u.rol,
      password: ''
    };
    this.mostrarFormulario = true;
  }

  desactivar(id: number): void {
    if (confirm('¿Desactivar este usuario?')) {
      this.usuarioService.desactivar(id).subscribe({
        next: () => { this.show('Usuario desactivado', false); this.cargar(); },
        error: err => this.show(err.error?.mensaje || 'Error al desactivar', true)
      });
    }
  }

  cancelarForm(): void {
    this.mostrarFormulario = false;
    this.editandoId = null;
    this.formUsuario = {
      identificacion: '',
      nombre: '',
      apellido: '',
      email: '',
      rol: Rol.ESTUDIANTE,
      password: ''
    };
  }

  private show(msg: string, error: boolean): void {
    this.mensaje = msg;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 4000);
  }

  rolLabel(r: Rol): string { return ROL_LABELS[r] || r; }
}
