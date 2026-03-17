import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UnitConverterComponent } from './components/exercises/unit-converter/unit-converter.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  // Exercises routes
  { path: 'exercises/unit-converter', component: UnitConverterComponent },
  
  { path: '**', redirectTo: '/dashboard' }
];
