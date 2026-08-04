import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { JobDetailComponent } from './features/jobs/job-detail/job-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { CandidateDashboardComponent } from './features/candidate/candidate-dashboard/candidate-dashboard.component';
import { CompanyDashboardComponent } from './features/company/company-dashboard/company-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';

import { authGuard, unauthGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  
  // Guest only auth routes
  { path: 'auth/login', component: LoginComponent, canActivate: [unauthGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [unauthGuard] },
  { path: 'auth/verify-email', component: VerifyEmailComponent },

  // Candidate dashboard routes
  { path: 'candidate/dashboard', component: CandidateDashboardComponent, canActivate: [authGuard, roleGuard(['candidate'])] },
  { path: 'candidate/saved', component: CandidateDashboardComponent, canActivate: [authGuard, roleGuard(['candidate'])] },
  
  // Recruiter dashboard routes
  { path: 'company/dashboard', component: CompanyDashboardComponent, canActivate: [authGuard, roleGuard(['company'])] },

  // Admin dashboard routes
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, roleGuard(['admin'])] },

  // Catch-all
  { path: '**', redirectTo: '' }
];
