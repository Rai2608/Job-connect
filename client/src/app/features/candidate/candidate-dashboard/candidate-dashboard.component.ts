import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Welcome Header -->
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900 font-display">Candidate Dashboard</h1>
          <p class="text-slate-500 mt-2 text-sm">Update your credentials, upload resumes, and track job applications</p>
        </div>
        
        <!-- Tab selector -->
        <div class="flex bg-white border border-slate-200 p-1.5 rounded-xl self-start shadow-sm">
          <button (click)="activeTab = 'applications'"
            [class.bg-brand-600]="activeTab === 'applications'" [class.text-white]="activeTab === 'applications'"
            [class.text-slate-500]="activeTab !== 'applications'" [class.hover:text-slate-800]="activeTab !== 'applications'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.453.25-.718.25H4.875a1.072 1.072 0 0 1-.718-.25m16.5 0a2.18 2.18 0 0 1-.75 1.661v3.586a1.682 1.682 0 0 1-.5 1.2l-3 3a1.682 1.682 0 0 1-1.2.5H6.875a1.682 1.682 0 0 1-1.2-.5l-3-3a1.682 1.682 0 0 1-.5-1.2V15.81" />
            </svg>
            Applications
          </button>
          <button (click)="activeTab = 'profile'"
            [class.bg-brand-600]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'"
            [class.text-slate-500]="activeTab !== 'profile'" [class.hover:text-slate-800]="activeTab !== 'profile'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            My Profile
          </button>
          <button (click)="activeTab = 'saved'"
            [class.bg-brand-600]="activeTab === 'saved'" [class.text-white]="activeTab === 'saved'"
            [class.text-slate-500]="activeTab !== 'saved'" [class.hover:text-slate-800]="activeTab !== 'saved'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c-.195-.49-.838-.49-1.033 0L8.4 7.542l-4.477.36c-.534.043-.747.696-.344 1.066l3.393 3.126-.963 4.41c-.115.526.44.928.9.684L10 15.01l3.794 2.192c.46.266 1.015-.136.9-.684l-.963-4.41 3.393-3.126c.402-.37.19-.102-.344-1.066l-4.478-.36-1.902-4.043Z" />
            </svg>
            Saved Jobs
          </button>
        </div>
      </div>

      <!-- APPLICATIONS TAB -->
      <div *ngIf="activeTab === 'applications'" class="space-y-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Application History</h2>
        
        <!-- Loader -->
        <div *ngIf="isLoading" class="py-12 text-center">
          <div class="w-8 h-8 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
        </div>

        <!-- Empty state -->
        <div *ngIf="!isLoading && applications.length === 0" class="py-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p class="text-slate-500 text-sm">You haven't applied to any jobs yet.</p>
          <a routerLink="/jobs" class="mt-4 inline-block text-xs font-bold text-brand-600 hover:underline">Explore Jobs &rarr;</a>
        </div>

        <!-- Cards -->
        <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngFor="let app of applications" class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between gap-4">
            <div>
              <div class="flex justify-between items-start gap-4">
                <div>
                  <h3 class="text-slate-900 font-bold text-lg hover:text-brand-600 cursor-pointer" [routerLink]="['/jobs', app.jobId?._id]">{{app.jobId?.title || 'Job Unavailable'}}</h3>
                  <p class="text-slate-500 text-xs mt-1 font-semibold">{{app.jobId?.companyId?.companyName}}</p>
                </div>
                <span [class]="getStatusClass(app.status)" class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {{app.status}}
                </span>
              </div>
              <p class="text-slate-450 text-xs mt-4">Applied on: {{app.createdAt | date:'mediumDate'}}</p>
            </div>

            <div class="border-t border-slate-105 pt-4 mt-2 flex items-center justify-between">
              <a [href]="app.resumeUrl" target="_blank" class="text-xs text-brand-600 hover:underline">View Submitted Resume</a>
              <a [routerLink]="['/jobs', app.jobId?._id]" class="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all">Details</a>
            </div>
          </div>
        </div>
      </div>

      <!-- PROFILE TAB -->
      <div *ngIf="activeTab === 'profile'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Upload resume & details summary -->
        <div class="space-y-6">
          <!-- Resume upload card -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <h3 class="font-bold text-slate-900 text-base">Your Resume</h3>
            <p class="text-slate-500 text-xs">Upload your latest PDF/DOC resume (max 5MB)</p>
            
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-400 mb-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span *ngIf="profile?.resumeUrl" class="text-xs text-brand-600 font-semibold truncate max-w-full">
                <a [href]="profile.resumeUrl" target="_blank" class="hover:underline">Resume Uploaded &rarr;</a>
              </span>
              <span *ngIf="!profile?.resumeUrl" class="text-xs text-amber-600">No resume attached</span>
            </div>

            <!-- Upload input button -->
            <div class="relative">
              <input type="file" (change)="onFileSelected($event)" accept=".pdf,.doc,.docx" class="hidden" #fileInput>
              <button (click)="fileInput.click()" [disabled]="isUploadingResume"
                class="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-205 transition-colors disabled:opacity-40">
                {{ isUploadingResume ? 'Uploading...' : 'Upload/Replace Resume' }}
              </button>
            </div>
            <p *ngIf="resumeSuccess" class="text-xs text-green-600">{{resumeSuccess}}</p>
            <p *ngIf="resumeError" class="text-xs text-red-655">{{resumeError}}</p>
          </div>
        </div>

        <!-- Right: Profile edit fields -->
        <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 class="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Edit Candidate Profile</h3>

          <!-- Form feedback messages -->
          <div *ngIf="profileSuccess" class="p-3 text-xs rounded-xl bg-green-50 border border-green-150 text-green-700">
            Profile updated successfully.
          </div>
          <div *ngIf="profileError" class="p-3 text-xs rounded-xl bg-red-50 border border-red-150 text-red-700">
            {{ profileError }}
          </div>

          <form (ngSubmit)="saveProfile()" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Professional Headline</label>
              <input type="text" [(ngModel)]="editProfile.headline" name="headline"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all"
                placeholder="e.g. Senior Backend Engineer | Node.js | Mongoose">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Professional Summary</label>
              <textarea [(ngModel)]="editProfile.summary" name="summary" rows="4"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all resize-none"
                placeholder="Brief description of your expertise, career highlights..."></textarea>
            </div>

            <!-- Skills editor -->
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills (Comma Separated)</label>
              <input type="text" [(ngModel)]="skillsInput" name="skills" (blur)="parseSkills()"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all"
                placeholder="e.g. JavaScript, Angular, Node.js, Express">
            </div>

            <!-- Social Links -->
            <div class="space-y-4">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Social profiles</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <input type="text" [(ngModel)]="editProfile.links.linkedin" name="linkedin"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all"
                    placeholder="LinkedIn Link">
                </div>
                <div>
                  <input type="text" [(ngModel)]="editProfile.links.github" name="github"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all"
                    placeholder="GitHub Link">
                </div>
                <div>
                  <input type="text" [(ngModel)]="editProfile.links.portfolio" name="portfolio"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-brand-500 transition-all"
                    placeholder="Portfolio Link">
                </div>
              </div>
            </div>

            <button type="submit" [disabled]="isSavingProfile"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/10 disabled:opacity-50">
              {{ isSavingProfile ? 'Saving...' : 'Save Profile Details' }}
            </button>
          </form>
        </div>
      </div>

      <!-- SAVED JOBS TAB -->
      <div *ngIf="activeTab === 'saved'" class="space-y-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Saved Bookmarks</h2>

        <div *ngIf="savedJobs.length === 0" class="py-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-500">
          <p>You haven't saved any jobs yet.</p>
        </div>

        <div class="space-y-4">
          <div *ngFor="let job of savedJobs" class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-250 flex items-center justify-center font-bold text-slate-500">
                {{job.companyId?.companyName?.substring(0, 2) || 'CO'}}
              </div>
              <div>
                <h3 class="text-slate-800 font-bold hover:text-brand-600 cursor-pointer" [routerLink]="['/jobs', job._id]">{{job.title}}</h3>
                <p class="text-slate-500 text-xs mt-0.5">{{job.companyId?.companyName}} &bull; {{job.location}}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 justify-end">
              <button (click)="removeSavedJob(job._id)" class="text-xs text-red-650 hover:text-red-750 hover:underline px-3 py-1.5">Remove</button>
              <a [routerLink]="['/jobs', job._id]" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs">Apply Now &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CandidateDashboardComponent implements OnInit {
  activeTab: 'applications' | 'profile' | 'saved' = 'applications';
  isLoading = false;
  isSavingProfile = false;
  isUploadingResume = false;
  
  profile: any = null;
  applications: any[] = [];
  savedJobs: any[] = [];
  
  skillsInput = '';
  profileSuccess = false;
  profileError = '';
  resumeSuccess = '';
  resumeError = '';

  editProfile = {
    headline: '',
    summary: '',
    skills: [] as string[],
    links: {
      linkedin: '',
      github: '',
      portfolio: '',
    },
  };

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url.length > 0 && url[0].path === 'saved') {
        this.activeTab = 'saved';
      }
    });
    this.fetchApplications();
    this.fetchProfile();
    this.fetchSavedJobs();
  }

  fetchProfile(): void {
    this.candidateService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.profile = res.data;
          this.editProfile.headline = res.data.headline || '';
          this.editProfile.summary = res.data.summary || '';
          this.editProfile.skills = res.data.skills || [];
          this.skillsInput = this.editProfile.skills.join(', ');
          
          this.editProfile.links = {
            linkedin: res.data.links?.linkedin || '',
            github: res.data.links?.github || '',
            portfolio: res.data.links?.portfolio || '',
          };
        }
      },
    });
  }

  fetchApplications(): void {
    this.isLoading = true;
    this.candidateService.getApplications().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.applications = res.data;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  fetchSavedJobs(): void {
    this.candidateService.getSavedJobs().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.savedJobs = res.data;
        }
      },
    });
  }

  parseSkills(): void {
    this.editProfile.skills = this.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  saveProfile(): void {
    this.isSavingProfile = true;
    this.profileSuccess = false;
    this.profileError = '';
    this.parseSkills();

    this.candidateService.updateProfile(this.editProfile).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        if (res.success) {
          this.profileSuccess = true;
          this.profile = res.data;
        }
      },
      error: (err) => {
        this.isSavingProfile = false;
        if (err.error?.errors) {
          this.profileError = err.error.errors.map((e: any) => e.message).join(', ');
        } else {
          this.profileError = err.error?.message || 'Failed to update profile. Please check your inputs.';
        }
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingResume = true;
    this.resumeSuccess = '';
    this.resumeError = '';

    this.candidateService.uploadResume(file).subscribe({
      next: (res) => {
        this.isUploadingResume = false;
        if (res.success) {
          this.resumeSuccess = 'Resume uploaded successfully!';
          this.profile.resumeUrl = res.data.resumeUrl;
        }
      },
      error: (err) => {
        this.isUploadingResume = false;
        this.resumeError = err.error?.message || 'Upload failed.';
      },
    });
  }

  removeSavedJob(jobId: string): void {
    this.candidateService.toggleSaveJob(jobId).subscribe({
      next: (res) => {
        if (res.success) {
          this.savedJobs = this.savedJobs.filter((j) => j._id !== jobId);
        }
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 border border-blue-100 text-blue-600';
      case 'Under Review':
        return 'bg-amber-50 border border-amber-100 text-amber-700';
      case 'Shortlisted':
        return 'bg-purple-50 border border-purple-100 text-purple-600';
      case 'Interview Scheduled':
        return 'bg-indigo-50 border border-indigo-100 text-indigo-600';
      case 'Hired':
        return 'bg-green-50 border border-green-100 text-green-600';
      case 'Rejected':
        return 'bg-red-50 border border-red-100 text-red-600';
      default:
        return 'bg-slate-50 border border-slate-100 text-slate-600';
    }
  }
}
