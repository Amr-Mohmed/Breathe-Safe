import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataComponent } from './data/data.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'data', component: DataComponent },
  { path: 'subscription', loadComponent: () => import('./subscription/subscription.component').then(m => m.SubscriptionComponent) },
  { path: 'improve', loadComponent: () => import('./improve/improve.component').then(m => m.ImproveComponent) },
  { path: '**', redirectTo: '' }
];
