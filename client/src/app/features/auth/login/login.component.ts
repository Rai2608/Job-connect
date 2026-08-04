import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="relative min-h-[85vh] flex items-center justify-center bg-[#f8fafc] px-6">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_50%)]"></div>
      
      <!-- Card wrapper -->
      <div class="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl relative z-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-slate-900 font-display tracking-tight">Welcome Back</h2>
          <p class="text-slate-500 text-sm mt-2">Log in to manage your jobs or applications</p>
        </div>

        <!-- Success Banner -->
        <div *ngIf="successMessage" class="p-3 mb-6 text-sm rounded-xl bg-green-50/80 border border-green-200 text-green-700">
          {{ successMessage }}
        </div>

        <!-- Error Banner -->
        <div *ngIf="errorMessage" class="p-3 mb-6 text-sm rounded-xl bg-red-50/80 border border-red-200 text-red-700">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" name="email" [(ngModel)]="email" required email #emailRef="ngModel"
              class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
              placeholder="you@example.com">
            <span *ngIf="emailRef.invalid && emailRef.touched" class="text-xs text-red-500 mt-1 block">Please enter a valid email.</span>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <a routerLink="/auth/forgot-password" class="text-xs text-brand-600 hover:underline">Forgot?</a>
            </div>
            <input type="password" name="password" [(ngModel)]="password" required minlength="6" #passRef="ngModel"
              class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
              placeholder="••••••••">
            <span *ngIf="passRef.invalid && passRef.touched" class="text-xs text-red-500 mt-1 block">Password is required.</span>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/10 disabled:opacity-50 disabled:pointer-events-none mt-2">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
              Signing in...
            </span>
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Don't have an account?
          <a routerLink="/auth/register" class="text-brand-600 hover:underline font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check if redirect has messages
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['message']) {
      this.successMessage = state['message'];
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const user = res.data.user;
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            if (user.role === 'candidate') this.router.navigate(['/candidate/dashboard']);
            else if (user.role === 'company') this.router.navigate(['/company/dashboard']);
            else if (user.role === 'admin') this.router.navigate(['/admin/dashboard']);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check credentials.';
      },
    });
  }
}
