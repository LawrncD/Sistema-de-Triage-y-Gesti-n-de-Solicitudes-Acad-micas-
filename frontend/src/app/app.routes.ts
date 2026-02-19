import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SolicitudListComponent } from './components/solicitud-list/solicitud-list.component';
import { SolicitudCreateComponent } from './components/solicitud-create/solicitud-create.component';
import { SolicitudDetailComponent } from './components/solicitud-detail/solicitud-detail.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'solicitudes', component: SolicitudListComponent },
  { path: 'solicitudes/nueva', component: SolicitudCreateComponent },
  { path: 'solicitudes/:id', component: SolicitudDetailComponent },
  { path: 'usuarios', component: UsuarioListComponent },
  { path: '**', redirectTo: 'dashboard' }
];
