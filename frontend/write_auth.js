const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src/app');

// Ensure components auth directory
const authDir = path.join(srcApp, 'components/auth');
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

// 1. Auth Component (Login & Register)
const authTs = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLogin = true;
  authForm: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // Register only
      identificacion: [''],
      nombre: [''],
      apellido: [''],
      rol: ['ESTUDIANTE']
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMsg = '';
    
    if (this.isLogin) {
      this.authForm.get('identificacion')?.clearValidators();
      this.authForm.get('nombre')?.clearValidators();
      this.authForm.get('apellido')?.clearValidators();
    } else {
      this.authForm.get('identificacion')?.setValidators(Validators.required);
      this.authForm.get('nombre')?.setValidators(Validators.required);
      this.authForm.get('apellido')?.setValidators(Validators.required);
    }
    
    this.authForm.get('identificacion')?.updateValueAndValidity();
    this.authForm.get('nombre')?.updateValueAndValidity();
    this.authForm.get('apellido')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.errorMsg = 'Por favor revisa los campos en rojo.';
      this.authForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const val = this.authForm.value;

    if (this.isLogin) {
      this.authService.login(val.email, val.password).subscribe({
        next: (res) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.mensaje || 'Error al iniciar sesiÃ³n';
        }
      });
    } else {
      this.authService.register(val).subscribe({
        next: (res) => {
          this.loading = false;
          this.isLogin = true;
          this.errorMsg = '';
          alert('Â¡Cuenta creada exitosamente! Ahora inicia sesiÃ³n.');
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.mensaje || 'Hubo un error al crear la cuenta';
        }
      });
    }
  }
}`;

const authHtml = `<div class="auth-wrapper">
  <div class="auth-card fade-in">
    <div class="auth-header">
      <div class="logo">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <h2>{{ isLogin ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta' }}</h2>
      <p>{{ isLogin ? 'Ingresa tus credenciales para acceder' : 'Ãšnete al sistema acadÃ©mico' }}</p>
    </div>

    <div *ngIf="errorMsg" class="alert-error">
      <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
    </div>

    <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="auth-form">
      <div class="input-group">
        <label>Correo ElectrÃ³nico</label>
        <input type="email" formControlName="email" placeholder="ejemplo@uniquindio.edu.co" 
          [class.invalid]="authForm.get('email')?.invalid && authForm.get('email')?.touched">
      </div>
      
      <div class="input-group">
        <label>ContraseÃ±a</label>
        <input type="password" formControlName="password" placeholder="Tu contraseÃ±a secreta" 
          [class.invalid]="authForm.get('password')?.invalid && authForm.get('password')?.touched">
      </div>

      <ng-container *ngIf="!isLogin">
        <div class="input-group">
          <label>IdentificaciÃ³n</label>
          <input type="text" formControlName="identificacion" placeholder="Documento de identidad">
        </div>
        <div class="row-group">
          <div class="input-group">
            <label>Nombre</label>
            <input type="text" formControlName="nombre" placeholder="Tu nombre">
          </div>
          <div class="input-group">
            <label>Apellido</label>
            <input type="text" formControlName="apellido" placeholder="Tus apellidos">
          </div>
        </div>
        <div class="input-group">
          <label>Rol AcadÃ©mico</label>
          <select formControlName="rol">
            <option value="ESTUDIANTE">Soy Estudiante</option>
            <option value="DOCENTE">Soy Docente</option>
            <option value="ADMINISTRATIVO">Soy Administrativo</option>
          </select>
        </div>
      </ng-container>

      <button type="submit" class="btn-primary" [disabled]="loading">
        <span *ngIf="!loading">{{ isLogin ? 'Iniciar SesiÃ³n' : 'Registrarse' }}</span>
        <span *ngIf="loading" class="spinner"></span>
      </button>
    </form>

    <div class="auth-footer">
      <p *ngIf="isLogin">Â¿No tienes cuenta? <a (click)="toggleMode()">RegÃstrate aquÃ</a></p>
      <p *ngIf="!isLogin">Â¿Ya tienes cuenta? <a (click)="toggleMode()">Inicia SesiÃ³n</a></p>
    </div>
  </div>
</div>`;

const authCss = `.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  padding: 40px 30px;
  overflow: hidden;
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 3rem;
  color: #2a5298;
  margin-bottom: 10px;
}

.auth-header h2 {
  color: #333;
  margin: 0 0 5px;
  font-size: 1.8rem;
  font-weight: 700;
}

.auth-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

.input-group input, .input-group select {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
  background: #f9fbfd;
}

.input-group input:focus, .input-group select:focus {
  border-color: #2a5298;
  background: white;
  outline: none;
  box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1);
}

.input-group input.invalid {
  border-color: #e74c3c;
  background: #fdf2f1;
}

.row-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.btn-primary {
  background: #ff7e5f;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 126, 95, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert-error {
  background: #fdf2f1;
  color: #e74c3c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-footer {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
  color: #666;
}

.auth-footer a {
  color: #2a5298;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.auth-footer a:hover {
  text-decoration: underline;
  color: #1e3c72;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`;

fs.writeFileSync(path.join(authDir, 'auth.component.ts'), authTs);
fs.writeFileSync(path.join(authDir, 'auth.component.html'), authHtml);
fs.writeFileSync(path.join(authDir, 'auth.component.css'), authCss);
console.log('Auth component created');