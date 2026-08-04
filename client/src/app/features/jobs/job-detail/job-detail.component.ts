import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-10">
      <!-- Back Link -->
      <a routerLink="/jobs" class="text-xs text-slate-500 hover:text-slate-850 transition-colors mb-6 inline-block font-semibold">&larr; Back to Listings</a>

      <!-- Loader -->
      <div *ngIf="isLoading" class="py-20 text-center">
        <div class="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
        <p class="text-sm text-slate-400 mt-4">Loading job details...</p>
      </div>

      <!-- Main Detail View -->
      <div *ngIf="!isLoading && job" class="space-y-8">
        
        <!-- Header Card -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xl overflow-hidden shrink-0">
              <img *ngIf="job.companyId?.logoUrl" [src]="job.companyId.logoUrl" class="w-full h-full object-cover">
              <span *ngIf="!job.companyId?.logoUrl">{{job.companyId?.companyName?.substring(0, 2) || 'CO'}}</span>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">{{job.title}}</h1>
              <p class="text-brand-600 font-medium mt-1 text-sm">{{job.companyId?.companyName}}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {{job.location}}
                </span>
                <span>&bull;</span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v4.5A2.25 2.25 0 0 0 2.25 13.5Zm18 0v4.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25v-4.5m10.5-11.25h-3v-1.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5Z" />
                  </svg>
                  {{job.jobType | titlecase}}
                </span>
              </div>
            </div>
          </div>

          <div class="text-left md:text-right w-full md:w-auto">
            <span class="text-slate-900 font-bold text-xl">{{job.salaryMin ? '$' + (job.salaryMin | number) : 'Negotiable'}}</span>
            <span class="text-xs text-slate-400 block">Salary expectations</span>
          </div>
        </div>

        <!-- Specifications Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <span class="text-xs text-slate-500 block uppercase font-semibold">Experience</span>
            <strong class="text-slate-800 text-sm mt-1 block">{{job.experienceLevel | titlecase}}</strong>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <span class="text-xs text-slate-500 block uppercase font-semibold">Job Type</span>
            <strong class="text-slate-800 text-sm mt-1 block">{{job.jobType | titlecase}}</strong>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <span class="text-xs text-slate-500 block uppercase font-semibold">Location</span>
            <strong class="text-slate-800 text-sm mt-1 block truncate">{{job.location}}</strong>
          </div>
          <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
            <span class="text-xs text-slate-500 block uppercase font-semibold">Deadline</span>
            <strong class="text-slate-800 text-sm mt-1 block">{{job.deadline ? (job.deadline | date:'mediumDate') : 'Open'}}</strong>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Left Main Body -->
          <div class="md:col-span-2 space-y-8">
            <!-- Job Description -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h2 class="text-xl font-bold text-slate-900">Job Description</h2>
              <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{{job.description}}</p>
            </div>

            <!-- Requirements -->
            <div *ngIf="job.requirements?.length > 0" class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h2 class="text-xl font-bold text-slate-900">Key Requirements</h2>
              <ul class="list-disc pl-5 text-slate-700 text-sm space-y-2">
                <li *ngFor="let req of job.requirements">{{req}}</li>
              </ul>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="space-y-6">
            <!-- Skills Card -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-bold text-slate-900 text-base">Desired Skills</h3>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of job.skills" class="px-3 py-1 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-100">
                  {{skill}}
                </span>
              </div>
            </div>

            <!-- Company Meta Card -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-bold text-slate-900 text-base">About Company</h3>
              <p class="text-slate-600 text-xs leading-relaxed">{{job.companyId?.description || 'No description provided by company.'}}</p>
              <div class="text-xs space-y-2 text-slate-500">
                <p class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3Z" />
                  </svg>
                  <strong>Industry:</strong> {{job.companyId?.industry || 'Tech'}}
                </p>
                <p class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <strong>Employees:</strong> {{job.companyId?.size || '10-50'}}
                </p>
                <p *ngIf="job.companyId?.website" class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  <strong>Website:</strong> <a [href]="job.companyId.website" target="_blank" class="text-brand-600 hover:underline">Visit Page</a>
                </p>
              </div>
            </div>

            <!-- Application Card Gated -->
            <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-bold text-slate-900 text-base">Submit Application</h3>
              
              <!-- Check Guest -->
              <div *ngIf="!authService.isAuthenticated()" class="text-center py-2 space-y-3">
                <p class="text-xs text-slate-500">You must be signed in as a candidate to apply.</p>
                <a routerLink="/auth/login" class="block w-full py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold text-center">
                  Sign In to Apply
                </a>
              </div>

              <!-- Check Company/Admin role -->
              <div *ngIf="authService.isAuthenticated() && !authService.isCandidate()" class="p-3 bg-brand-50 text-slate-600 text-xs rounded-xl border border-brand-100 text-center">
                Sign in with a candidate account to submit applications.
              </div>

              <!-- Candidate Application Action -->
              <div *ngIf="authService.isCandidate()" class="space-y-4">
                <div *ngIf="!hasApplied; else appliedBadge">
                  
                  <!-- Check if Resume Uploaded -->
                  <div *ngIf="!candidateProfile?.resumeUrl" class="space-y-3">
                    <p class="text-xs text-amber-600 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-amber-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      You need to upload your resume to your profile before applying.
                    </p>
                    <a routerLink="/candidate/dashboard" class="block w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750 text-xs font-bold text-center">
                      Update Profile
                    </a>
                  </div>

                  <!-- Resume Uploaded: Show Apply Form -->
                  <div *ngIf="candidateProfile?.resumeUrl" class="space-y-4">
                    <div class="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 truncate flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Current Resume Attached
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cover Note (Optional)</label>
                      <textarea [(ngModel)]="coverNote" rows="3"
                        class="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 transition-all resize-none"
                        placeholder="Introduce yourself to the recruiter..."></textarea>
                    </div>

                    <!-- Error message -->
                    <p *ngIf="applyError" class="text-xs text-red-650">{{applyError}}</p>

                    <button (click)="submitApplication()" [disabled]="isSubmitting"
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold transition-all disabled:opacity-40">
                      {{ isSubmitting ? 'Submitting...' : 'Send Application' }}
                    </button>
                  </div>

                </div>

                <ng-template #appliedBadge>
                  <div class="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-center space-y-1 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-green-600 mb-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="text-sm font-bold block">Applied</span>
                    <p class="text-[10px] text-slate-500">Manage status in your candidate dashboard</p>
                  </div>
                </ng-template>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  `,
})
export class JobDetailComponent implements OnInit {
  job: any = null;
  isLoading = true;
  isSubmitting = false;
  hasApplied = false;
  candidateProfile: any = null;
  coverNote = '';
  applyError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private candidateService: CandidateService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.fetchJobDetails(id);
    if (this.authService.isCandidate()) {
      this.fetchCandidateProfileAndCheckApplication(id);
    }
  }

  fetchJobDetails(id: string): void {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.job = res.data;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  fetchCandidateProfileAndCheckApplication(jobId: string): void {
    this.candidateService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.candidateProfile = res.data;
          
          // Check if applied
          this.candidateService.getApplications().subscribe({
            next: (appRes) => {
              if (appRes.success && appRes.data) {
                this.hasApplied = appRes.data.some((app: any) => app.jobId?._id === jobId);
              }
            }
          });
        }
      }
    });
  }

  submitApplication(): void {
    this.isSubmitting = true;
    this.applyError = '';
    
    this.jobService.applyToJob(this.job._id, this.coverNote).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.hasApplied = true;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.applyError = err.error?.message || 'Failed to submit application. Please try again.';
      }
    });
  }
}
