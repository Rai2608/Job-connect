import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative overflow-hidden bg-[#f8fafc] pb-16 pt-8">
      <!-- Gradient mesh blur background -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_50%)]"></div>
      
      <!-- Hero Section -->
      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center mt-12 mb-20">
        <h1 class="text-5xl md:text-7xl font-extrabold font-display text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Find your next dream role, <span class="bg-gradient-to-r from-brand-600 via-indigo-500 to-indigo-700 bg-clip-text text-transparent">effortlessly</span>.
        </h1>
        <p class="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          A high-performance job board connecting talented candidates, verified organizations, and smart interview schedules under one roof.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a routerLink="/jobs" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold transition-all hover:opacity-95 hover:scale-[1.01] shadow-lg shadow-brand-500/20">
            Browse Jobs
          </a>
          <a routerLink="/auth/register" [queryParams]="{role: 'company'}" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all hover:text-slate-950 shadow-sm">
            Hire Top Talents
          </a>
        </div>
      </div>

      <!-- Categories Section -->
      <div class="max-w-7xl mx-auto px-6 relative z-10 mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900">Popular Job Categories</h2>
          <p class="text-slate-500 mt-2">Explore thousands of open positions curated by tech roles.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div *ngFor="let cat of categories" class="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all group hover:translate-y-[-4px] cursor-pointer">
            <div class="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <ng-container [ngSwitch]="cat.name">
                <svg *ngSwitchCase="'Software Engineering'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
                <svg *ngSwitchCase="'Product Design'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 0 0-2.235 4.383a8.972 8.972 0 0 0 8.016-1.579a3 3 0 0 0 2.235-4.383a8.972 8.972 0 0 0-8.016 1.579Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.47 13.878 21 8.348v-3.75h-3.75l-5.53 5.53" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5l-3-3" />
                </svg>
                <svg *ngSwitchCase="'Data & Analytics'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                <svg *ngSwitchCase="'Marketing & Sales'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </ng-container>
            </div>
            <h3 class="text-slate-900 font-semibold text-lg">{{cat.name}}</h3>
            <p class="text-slate-500 text-sm mt-1">{{cat.jobsCount}} Open Positions</p>
          </div>
        </div>
      </div>

      <!-- Recent Jobs Preview -->
      <div class="max-w-5xl mx-auto px-6 relative z-10">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Featured Job Openings</h2>
            <p class="text-slate-500 text-sm mt-1">Handpicked opportunities from verified companies.</p>
          </div>
          <a routerLink="/jobs" class="text-brand-600 hover:underline text-sm font-semibold flex items-center gap-1">View All Jobs &rarr;</a>
        </div>

        <div class="space-y-4">
          <div *ngFor="let job of featuredJobs" class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg border border-slate-200 overflow-hidden">
                <img *ngIf="job.companyId?.logoUrl" [src]="job.companyId.logoUrl" class="w-full h-full object-cover">
                <span *ngIf="!job.companyId?.logoUrl">{{job.companyId?.companyName?.substring(0,2) || 'CO'}}</span>
              </div>
              <div>
                <h3 class="text-slate-800 font-bold text-lg hover:text-brand-600 cursor-pointer" [routerLink]="['/jobs', job._id]">{{job.title}}</h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                  <span>{{job.companyId?.companyName}}</span>
                  <span>&bull;</span>
                  <span>{{job.location}}</span>
                  <span>&bull;</span>
                  <span class="text-brand-600 font-medium">{{job.jobType | titlecase}}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-4 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
              <div class="text-left md:text-right">
                <span class="text-slate-900 font-semibold text-sm">{{job.salaryMin ? '$' + (job.salaryMin | number) : 'Salary Negotiable'}}</span>
                <p class="text-xs text-slate-400">Salary Range</p>
              </div>
              <a [routerLink]="['/jobs', job._id]" class="px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors text-sm">
                Apply
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  categories = [
    { name: 'Software Engineering', jobsCount: 142 },
    { name: 'Product Design', jobsCount: 56 },
    { name: 'Data & Analytics', jobsCount: 89 },
    { name: 'Marketing & Sales', jobsCount: 37 },
  ];
  featuredJobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobService.getJobs({ limit: 3 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.featuredJobs = res.data;
        }
      },
    });
  }
}
