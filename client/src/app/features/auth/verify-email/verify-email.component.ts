import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-[80vh] flex items-center justify-center bg-[#f8fafc] px-6">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_50%)]"></div>

      <div class="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl relative z-10 text-center">
        <!-- Verifying state -->
        <div *ngIf="status === 'verifying'">
          <div class="w-12 h-12 rounded-full border-4 border-brand-500/10 border-t-brand-500 animate-spin mx-auto mb-6"></div>
          <h2 class="text-2xl font-bold text-slate-900 font-display">Verifying Email...</h2>
          <p class="text-slate-500 text-sm mt-3">We are activating your account. Please wait a moment.</p>
        </div>

        <!-- Success state -->
        <div *ngIf="status === 'success'">
          <div class="w-16 h-16 rounded-full bg-green-50/80 border border-green-200 text-green-600 text-3xl flex items-center justify-center mx-auto mb-6">
            ✓
          </div>
          <h2 class="text-2xl font-bold text-slate-900 font-display">Email Verified!</h2>
          <p class="text-slate-500 text-sm mt-3 leading-relaxed">
            Your email has been verified successfully. Your profile is initialized and you are ready to log in.
          </p>
          <button (click)="goToLogin()" class="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01]">
            Proceed to Sign In
          </button>
        </div>

        <!-- Error state -->
        <div *ngIf="status === 'error'">
          <div class="w-16 h-16 rounded-full bg-red-50/80 border border-red-200 text-red-600 text-3xl flex items-center justify-center mx-auto mb-6">
            ✕
          </div>
          <h2 class="text-2xl font-bold text-slate-900 font-display">Verification Failed</h2>
          <p class="text-slate-500 text-sm mt-3 leading-relaxed">
            {{ errorMessage || 'The verification link is invalid, expired, or has already been used.' }}
          </p>
          <a routerLink="/auth/login" class="mt-8 inline-block px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  status: 'verifying' | 'success' | 'error' = 'verifying';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.status = 'error';
      this.errorMessage = 'Verification token is missing.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (res) => {
        if (res.success) {
          this.status = 'success';
        } else {
          this.status = 'error';
        }
      },
      error: (err) => {
        this.status = 'error';
        this.errorMessage = err.error?.message || 'Verification failed.';
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      state: { message: 'Email verified successfully. Please log in.' }
    });
  }
}
