import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">
          <span class="brand-icon">🎓</span>
          <span class="brand-text">Sistema de Triage Académico</span>
        </a>
      </div>
      <div class="navbar-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <a routerLink="/solicitudes" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">📋</span> Solicitudes
        </a>
        <a routerLink="/solicitudes/nueva" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
          <span class="nav-icon">➕</span> Nueva Solicitud
        </a>
        <a routerLink="/usuarios" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">👥</span> Usuarios
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      height: 60px;
    }
    .brand-link {
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-text {
      color: #fff;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .navbar-menu {
      display: flex;
      gap: 0.25rem;
    }
    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.12);
    }
    .nav-link.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
    }
    .nav-icon { font-size: 1rem; }
  `]
})
export class NavbarComponent {}
