import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="relative min-h-[85vh] flex items-center justify-center bg-[#f8fafc] px-6 py-12">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_50%)]"></div>

      <!-- Card wrapper -->
      <div class="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl relative z-10">
        <div class="text-center mb-8" *ngIf="!isRegistered">
          <h2 class="text-3xl font-extrabold text-slate-900 font-display tracking-tight">Create Account</h2>
          <p class="text-slate-500 text-sm mt-2">Join JobConnect to find roles or hire talents</p>
        </div>

        <!-- Success Registration Screen -->
        <div *ngIf="isRegistered" class="text-center py-6">
          <div class="w-16 h-16 rounded-full bg-green-50/80 border border-green-200 text-green-600 text-3xl flex items-center justify-center mx-auto mb-6">
            <svg *ngIf="isAutoVerified" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <svg *ngIf="!isAutoVerified" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 font-display">
            {{ isAutoVerified ? 'Account Registered!' : 'Check your email' }}
          </h3>
          <p class="text-slate-500 text-sm mt-3 leading-relaxed">
            <span *ngIf="isAutoVerified">
              In development mode, your account has been <strong>automatically verified</strong>. You can sign in immediately.
            </span>
            <span *ngIf="!isAutoVerified">
              We have sent a verification link to <strong class="text-slate-800">{{ email }}</strong>. Please click the link to activate your account.
            </span>
          </p>
          <a routerLink="/auth/login" class="mt-8 inline-block px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Go to Login
          </a>
        </div>

        <!-- Error Banner -->
        <div *ngIf="errorMessage" class="p-3 mb-6 text-sm rounded-xl bg-red-50/80 border border-red-200 text-red-700">
          {{ errorMessage }}
        </div>

        <!-- Registration Form -->
        <form *ngIf="!isRegistered" (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-5">
          <!-- Role selector buttons -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">I want to register as a</label>
            <div class="grid grid-cols-2 gap-4">
              <button type="button" (click)="role = 'candidate'"
                [class.border-brand-600]="role === 'candidate'" [class.bg-brand-50]="role === 'candidate'" [class.text-brand-600]="role === 'candidate'" [class.border-slate-200]="role !== 'candidate'" [class.text-slate-600]="role !== 'candidate'"
                class="py-3 rounded-xl border text-sm font-medium transition-all text-center flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Candidate
              </button>
              <button type="button" (click)="role = 'company'"
                [class.border-brand-600]="role === 'company'" [class.bg-brand-50]="role === 'company'" [class.text-brand-600]="role === 'company'" [class.border-slate-200]="role !== 'company'" [class.text-slate-600]="role !== 'company'"
                class="py-3 rounded-xl border text-sm font-medium transition-all text-center flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3Z" />
                </svg>
                Company / Recruiter
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" name="fullName" [(ngModel)]="fullName" required #nameRef="ngModel"
              class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
              placeholder="John Doe">
            <span *ngIf="nameRef.invalid && nameRef.touched" class="text-xs text-red-500 mt-1 block">Full name is required.</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" name="email" [(ngModel)]="email" required email #emailRef="ngModel"
              class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
              placeholder="john@example.com">
            <span *ngIf="emailRef.invalid && emailRef.touched" class="text-xs text-red-500 mt-1 block">Valid email is required.</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input type="password" name="password" [(ngModel)]="password" required minlength="8" #passRef="ngModel"
              class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-800 placeholder-slate-400 transition-all outline-none"
              placeholder="••••••••">
            <div class="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Must be at least 8 characters, with 1 number and 1 special character.
            </div>
            <span *ngIf="passRef.invalid && passRef.touched" class="text-xs text-red-500 mt-1 block">Password must be at least 8 characters.</span>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/10 disabled:opacity-50 disabled:pointer-events-none mt-2">
            <span *ngIf="!isLoading">Register</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
              Registering...
            </span>
          </button>
        </form>

        <p *ngIf="!isRegistered" class="text-center text-sm text-slate-500 mt-8">
          Already have an account?
          <a routerLink="/auth/login" class="text-brand-600 hover:underline font-semibold font-sans">Sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  fullName = '';
  email = '';
  password = '';
  role: 'candidate' | 'company' = 'candidate';
  
  isLoading = false;
  isRegistered = false;
  isAutoVerified = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if role is preselected in query param
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'company') {
        this.role = 'company';
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role,
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.isRegistered = true;
          if (res.data?.isVerified) {
            this.isAutoVerified = true;
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.errors) {
          this.errorMessage = err.error.errors.map((e: any) => e.message).join(', ');
        } else {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      },
    });
  }
}
