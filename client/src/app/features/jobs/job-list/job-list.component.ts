import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Page Title -->
      <div class="mb-10">
        <h1 class="text-4xl font-extrabold text-slate-900 font-display">Explore Job Openings</h1>
        <p class="text-slate-500 mt-2 text-sm">Discover and apply to verified positions across top engineering teams</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm h-fit space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">Filters</h3>
            <button (click)="clearFilters()" class="text-xs text-brand-600 hover:underline">Clear all</button>
          </div>

          <!-- Search keyword -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search Keyword</label>
            <input type="text" [(ngModel)]="filters.q" (ngModelChange)="onFilterChange()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 transition-all"
              placeholder="Title, skills, company...">
          </div>

          <!-- Location -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
            <input type="text" [(ngModel)]="filters.location" (ngModelChange)="onFilterChange()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 transition-all"
              placeholder="e.g. Remote, San Francisco">
          </div>

          <!-- Job Type -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
            <select [(ngModel)]="filters.jobType" (ngModelChange)="onFilterChange()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500 transition-all">
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <!-- Experience Level -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience Level</label>
            <select [(ngModel)]="filters.experienceLevel" (ngModelChange)="onFilterChange()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500 transition-all">
              <option value="">All Levels</option>
              <option value="entry">Entry-level</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior-level</option>
              <option value="lead">Lead / Principal</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <!-- Salary Filters -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Min Salary ($)</label>
            <input type="number" [(ngModel)]="filters.minSalary" (ngModelChange)="onFilterChange()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 transition-all"
              placeholder="e.g. 50000">
          </div>
        </div>

        <!-- Job Listings -->
        <div class="lg:col-span-3 space-y-6">
          <!-- List header controls -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span class="text-sm text-slate-500">Showing <strong class="text-slate-800">{{jobs.length}}</strong> of <strong class="text-slate-800">{{totalJobs}}</strong> jobs</span>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-500 font-medium">Sort By:</span>
              <select [(ngModel)]="filters.sort" (ngModelChange)="onFilterChange()"
                class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500">
                <option value="newest">Newest First</option>
                <option value="salary">Highest Salary</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <!-- Loader -->
          <div *ngIf="isLoading" class="py-20 text-center">
            <div class="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
            <p class="text-sm text-slate-400 mt-4">Searching database...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && jobs.length === 0" class="py-20 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto text-slate-300 mb-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
            <h3 class="text-lg font-bold text-slate-800">No jobs match your criteria</h3>
            <p class="text-sm text-slate-500 mt-1">Try tweaking filters or keyword searches</p>
          </div>

          <!-- Job Cards List -->
          <div *ngIf="!isLoading" class="space-y-4">
            <div *ngFor="let job of jobs" class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
              
              <div class="flex gap-4">
                <!-- Company logo -->
                <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-lg overflow-hidden shrink-0">
                  <img *ngIf="job.companyId?.logoUrl" [src]="job.companyId.logoUrl" class="w-full h-full object-cover">
                  <span *ngIf="!job.companyId?.logoUrl">{{job.companyId?.companyName?.substring(0, 2) || 'CO'}}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-slate-900 font-bold text-lg hover:text-brand-600 transition-colors cursor-pointer" [routerLink]="['/jobs', job._id]">{{job.title}}</h3>
                    <span *ngIf="isNewJob(job.createdAt)" class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 border border-brand-100 text-brand-600">NEW</span>
                  </div>
                  <p class="text-slate-600 text-sm mt-1 font-medium">{{job.companyId?.companyName}}</p>
                  
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-3">
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
                    <span>&bull;</span>
                    <span class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                      </svg>
                      {{job.experienceLevel | titlecase}}
                    </span>
                  </div>

                  <!-- Skills tags -->
                  <div class="flex flex-wrap gap-1.5 mt-4">
                    <span *ngFor="let skill of job.skills.slice(0, 4)" class="px-2 py-1 rounded bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-100">
                      {{skill}}
                    </span>
                    <span *ngIf="job.skills.length > 4" class="text-[10px] text-slate-400 self-center pl-1">+{{job.skills.length - 4}} more</span>
                  </div>
                </div>
              </div>

              <!-- Action buttons & info -->
              <div class="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t border-slate-100 sm:border-t-0 pt-4 sm:pt-0">
                <div class="text-left sm:text-right">
                  <span class="text-slate-900 font-bold text-base block">{{job.salaryMin ? '$' + (job.salaryMin | number) : 'Negotiable'}}</span>
                  <span class="text-[10px] text-slate-400 block mt-0.5">Salary expectation</span>
                </div>
                
                <div class="flex items-center gap-2">
                  <!-- Bookmark Button -->
                  <button *ngIf="authService.isCandidate()" (click)="toggleSaveJob(job)"
                    [class.text-brand-600]="isJobSaved(job._id)"
                    class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors flex items-center justify-center">
                    <svg *ngIf="isJobSaved(job._id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-brand-600">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                    </svg>
                    <svg *ngIf="!isJobSaved(job._id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c-.195-.49-.838-.49-1.033 0L8.4 7.542l-4.477.36c-.534.043-.747.696-.344 1.066l3.393 3.126-.963 4.41c-.115.526.44.928.9.684L10 15.01l3.794 2.192c.46.266 1.015-.136.9-.684l-.963-4.41 3.393-3.126c.402-.37.19-.102-.344-1.066l-4.478-.36-1.902-4.043Z" />
                    </svg>
                  </button>
                  
                  <a [routerLink]="['/jobs', job._id]" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs tracking-wide transition-colors">
                    Apply
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="!isLoading && totalPages > 1" class="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <button [disabled]="filters.page === 1" (click)="changePage(-1)"
              class="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none">
              &larr; Previous
            </button>
            <span class="text-xs text-slate-500">Page <strong class="text-slate-800">{{filters.page}}</strong> of <strong class="text-slate-800">{{totalPages}}</strong></span>
            <button [disabled]="filters.page === totalPages" (click)="changePage(1)"
              class="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none">
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class JobListComponent implements OnInit {
  jobs: any[] = [];
  totalJobs = 0;
  totalPages = 0;
  isLoading = false;
  
  filters: any = {
    q: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    minSalary: null,
    sort: 'newest',
    page: 1,
    limit: 10,
  };

  savedJobIds: string[] = [];

  constructor(
    private jobService: JobService,
    private candidateService: CandidateService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchJobs();
    if (this.authService.isCandidate()) {
      this.fetchSavedJobsList();
    }
  }

  fetchJobs(): void {
    this.isLoading = true;
    this.jobService.getJobs(this.filters).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.jobs = res.data;
          this.totalJobs = res.pagination.total;
          this.totalPages = res.pagination.totalPages;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  fetchSavedJobsList(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.savedJobIds = res.data.map((j: any) => j._id);
        }
      },
    });
  }

  onFilterChange(): void {
    this.filters.page = 1;
    this.fetchJobs();
  }

  changePage(step: number): void {
    this.filters.page += step;
    this.fetchJobs();
  }

  clearFilters(): void {
    this.filters = {
      q: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      minSalary: null,
      sort: 'newest',
      page: 1,
      limit: 10,
    };
    this.fetchJobs();
  }

  isJobSaved(jobId: string): boolean {
    return this.savedJobIds.includes(jobId);
  }

  toggleSaveJob(job: any): void {
    this.candidateService.toggleSaveJob(job._id).subscribe({
      next: (res) => {
        if (res.success) {
          const idx = this.savedJobIds.indexOf(job._id);
          if (idx > -1) {
            this.savedJobIds.splice(idx, 1);
          } else {
            this.savedJobIds.push(job._id);
          }
        }
      },
    });
  }

  isNewJob(createdAtStr: string): boolean {
    const diff = Date.now() - new Date(createdAtStr).getTime();
    return diff < 48 * 60 * 60 * 1000; // 48 hours
  }
}
