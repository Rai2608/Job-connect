import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10">
      
      <!-- Welcome Recruiter Header -->
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900 font-display">Recruiter Dashboard</h1>
          <p class="text-slate-500 mt-2 text-sm">Post jobs, track applicants, and schedule candidate interviews</p>
        </div>

        <!-- Tab Selector -->
        <div class="flex bg-white border border-slate-200 p-1.5 rounded-xl self-start shadow-sm">
          <button (click)="activeTab = 'postings'"
            [class.bg-brand-600]="activeTab === 'postings'" [class.text-white]="activeTab === 'postings'"
            [class.text-slate-500]="activeTab !== 'postings'" [class.hover:text-slate-800]="activeTab !== 'postings'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.453.25-.718.25H4.875a1.072 1.072 0 0 1-.718-.25m16.5 0a2.18 2.18 0 0 1-.75 1.661v3.586a1.682 1.682 0 0 1-.5 1.2l-3 3a1.682 1.682 0 0 1-1.2.5H6.875a1.682 1.682 0 0 1-1.2-.5l-3-3a1.682 1.682 0 0 1-.5-1.2V15.81" />
            </svg>
            Job Postings
          </button>
          <button (click)="activeTab = 'create-job'" [disabled]="companyProfile?.verificationStatus !== 'verified'"
            [class.bg-brand-600]="activeTab === 'create-job'" [class.text-white]="activeTab === 'create-job'"
            [class.text-slate-500]="activeTab !== 'create-job'" [class.hover:text-slate-800]="activeTab !== 'create-job'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Post New Job
          </button>
          <button (click)="activeTab = 'profile'"
            [class.bg-brand-600]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'"
            [class.text-slate-500]="activeTab !== 'profile'" [class.hover:text-slate-800]="activeTab !== 'profile'"
            class="px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3Z" />
            </svg>
            Profile Settings
          </button>
        </div>
      </div>

      <!-- Verification Alert Banner -->
      <div *ngIf="companyProfile" class="mb-8">
        <!-- Verification Pending -->
        <div *ngIf="companyProfile.verificationStatus === 'pending'" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2050/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-amber-600 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div>
            <strong>Verification Pending:</strong> Your company profile is undergoing administrative review. You will be able to create job postings once verified.
          </div>
        </div>

        <!-- Verification Rejected -->
        <div *ngIf="companyProfile.verificationStatus === 'rejected'" class="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-600 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <strong>Verification Rejected:</strong> Reason: "{{ companyProfile.rejectionReason }}". Please update your company profile information and wait for re-evaluation.
          </div>
        </div>
      </div>

      <!-- TAB: JOB POSTINGS & APPLICANTS -->
      <div *ngIf="activeTab === 'postings'" class="space-y-8">
        
        <!-- Grid layout: left is job postings, right is applicants for selected job -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left list: job postings -->
          <div class="lg:col-span-1 space-y-4">
            <h2 class="text-lg font-bold text-slate-900 mb-4">Your Job Postings</h2>
            
            <div *ngIf="jobsList.length === 0" class="p-6 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-sm shadow-sm">
              No postings found.
            </div>

            <div *ngFor="let job of jobsList" (click)="selectJob(job)"
              [class.border-brand-600]="selectedJob?._id === job._id" [class.shadow-md]="selectedJob?._id === job._id"
              class="p-5 rounded-2xl bg-white border border-slate-200/85 hover:border-brand-500/40 cursor-pointer transition-all shadow-sm">
              <div class="flex justify-between items-start gap-4">
                <h3 class="text-slate-900 font-bold text-base">{{job.title}}</h3>
                <span [ngClass]="{'bg-green-50 border border-green-150 text-green-600': job.status === 'active', 'bg-red-50 border border-red-150 text-red-600': job.status === 'closed'}"
                  class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  {{job.status}}
                </span>
              </div>
              <p class="text-slate-500 text-xs mt-1">{{job.location}} &bull; {{job.jobType | titlecase}}</p>
              
              <div class="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                <span class="text-xs text-slate-500">Click to view applicants</span>
                <button (click)="archiveJob(job._id, $event)" *ngIf="job.status === 'active'" class="text-xs text-red-650 hover:text-red-750 hover:underline">Close Job</button>
              </div>
            </div>
          </div>

          <!-- Right: Applicants list & status manager -->
          <div class="lg:col-span-2 space-y-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm h-fit">
            <div *ngIf="!selectedJob" class="py-20 text-center text-slate-500 text-sm">
              Select a job posting from the left to view and manage applicants.
            </div>

            <div *ngIf="selectedJob">
              <div class="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 class="text-xl font-bold text-slate-900">Applicants for: {{selectedJob.title}}</h2>
                  <p class="text-xs text-slate-500 mt-1">Status updates will automatically notify the candidate via email.</p>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-550">Filter Status:</span>
                  <select [(ngModel)]="applicantFilterStatus" (ngModelChange)="fetchApplicants(selectedJob._id)"
                    class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500">
                    <option value="">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <!-- Loader/Empty State -->
              <div *ngIf="isApplicantsLoading" class="py-12 text-center">
                <div class="w-6 h-6 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
              </div>

              <div *ngIf="!isApplicantsLoading && applicants.length === 0" class="py-12 text-center text-slate-500 text-sm">
                No applicants match the selected filters.
              </div>

              <!-- Applicants list -->
              <div *ngIf="!isApplicantsLoading && applicants.length > 0" class="space-y-4">
                <div *ngFor="let app of applicants" class="p-5 rounded-2xl bg-slate-50/50 border border-slate-150 space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 class="text-slate-900 font-bold text-base">{{app.candidateId?.userId?.fullName}}</h4>
                      <p class="text-xs text-slate-500 mt-0.5">{{app.candidateId?.userId?.email}} &bull; {{app.candidateId?.headline || 'No Headline'}}</p>
                      
                      <!-- Links -->
                      <div class="flex items-center gap-3 mt-2 text-xs">
                        <a *ngIf="app.candidateId?.links?.linkedin" [href]="app.candidateId.links.linkedin" target="_blank" class="text-brand-600 hover:underline font-medium">LinkedIn</a>
                        <a *ngIf="app.candidateId?.links?.github" [href]="app.candidateId.links.github" target="_blank" class="text-brand-600 hover:underline font-medium">GitHub</a>
                        <a [href]="app.resumeUrl" target="_blank" class="text-green-600 hover:text-green-700 hover:underline font-semibold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          Download Resume
                        </a>
                      </div>
                    </div>

                    <!-- Manage Status dropdown -->
                    <div class="flex flex-col items-end gap-2 shrink-0">
                      <span [class]="getStatusClass(app.status)" class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1">
                        {{app.status}}
                      </span>
                      
                      <div class="flex items-center gap-1.5">
                        <select (change)="updateStatus(app, $event)" [value]="app.status"
                          class="px-2 py-1 rounded bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500">
                          <option value="Applied" disabled>Applied</option>
                          <option value="Under Review" [disabled]="app.status !== 'Applied'">Move to: Under Review</option>
                          <option value="Shortlisted" [disabled]="app.status !== 'Under Review'">Move to: Shortlisted</option>
                          <option value="Interview Scheduled" [disabled]="app.status !== 'Shortlisted'">Move to: Interview</option>
                          <option value="Hired" [disabled]="app.status !== 'Interview Scheduled'">Move to: Hired</option>
                          <option value="Rejected" [disabled]="app.status === 'Hired' || app.status === 'Rejected'">Reject Candidate</option>
                        </select>
                        
                        <!-- Interview scheduler button -->
                        <button *ngIf="app.status === 'Shortlisted'" (click)="openInterviewModal(app)"
                          class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                          </svg>
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Cover Note -->
                  <div *ngIf="app.coverNote" class="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed shadow-xs">
                    <strong>Cover Note:</strong> "{{ app.coverNote }}"
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- TAB: CREATE JOB POSTING -->
      <div *ngIf="activeTab === 'create-job'" class="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h2 class="text-2xl font-bold text-slate-900 font-display border-b border-slate-100 pb-3">Create New Job Posting</h2>

        <form (ngSubmit)="publishJob()" #jobForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Title</label>
            <input type="text" [(ngModel)]="newJob.title" name="title" required
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 transition-all"
              placeholder="e.g. Senior Frontend Angular Developer">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
              <select [(ngModel)]="newJob.jobType" name="jobType" required
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Experience Level</label>
              <select [(ngModel)]="newJob.experienceLevel" name="experienceLevel" required
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500">
                <option value="entry">Entry-level</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior-level</option>
                <option value="lead">Lead / Principal</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <input type="text" [(ngModel)]="newJob.location" name="location" required
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                placeholder="e.g. London, UK or Remote">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Salary Estimate ($)</label>
              <input type="number" [(ngModel)]="newJob.salaryMin" name="salaryMin"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                placeholder="e.g. 90000">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Skills (Comma Separated)</label>
            <input type="text" [(ngModel)]="skillsInput" name="skills" (blur)="parseSkills()"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
              placeholder="e.g. Angular, Typescript, CSS, HTML">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Description</label>
            <textarea [(ngModel)]="newJob.description" name="description" required rows="6"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 resize-none"
              placeholder="Detailed description of responsibilities, requirements, benefits..."></textarea>
          </div>

          <button type="submit" [disabled]="jobForm.invalid || isPublishing"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/10">
            {{ isPublishing ? 'Publishing...' : 'Publish Job Posting' }}
          </button>
        </form>
      </div>

      <!-- TAB: PROFILE SETTINGS -->
      <div *ngIf="activeTab === 'profile'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Logo uploader -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <h3 class="font-bold text-slate-900 text-base">Company Logo</h3>
          
          <div class="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xl overflow-hidden mx-auto">
            <img *ngIf="companyProfile?.logoUrl" [src]="companyProfile.logoUrl" class="w-full h-full object-cover">
            <span *ngIf="!companyProfile?.logoUrl">{{ companyProfile?.companyName?.substring(0, 2) || 'CO' }}</span>
          </div>

          <div class="relative">
            <input type="file" (change)="onLogoSelected($event)" accept=".jpg,.jpeg,.png" class="hidden" #logoInput>
            <button (click)="logoInput.click()" [disabled]="isUploadingLogo"
              class="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors">
              {{ isUploadingLogo ? 'Uploading...' : 'Replace Logo Image' }}
            </button>
          </div>
          <p *ngIf="logoSuccess" class="text-xs text-green-600">{{logoSuccess}}</p>
        </div>

        <!-- Details Editor -->
        <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 class="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Edit Company Details</h3>
          
          <div *ngIf="profileSuccess" class="p-3 text-xs rounded-xl bg-green-50 border border-green-150 text-green-700">
            Company information updated successfully.
          </div>
          <div *ngIf="profileError" class="p-3 text-xs rounded-xl bg-red-50 border border-red-150 text-red-750">
            {{ profileError }}
          </div>

          <form (ngSubmit)="saveProfile()" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Registered Name</label>
              <input type="text" [(ngModel)]="editProfile.companyName" name="companyName" required
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                placeholder="Google Inc.">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Industry Sector</label>
                <input type="text" [(ngModel)]="editProfile.industry" name="industry"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                  placeholder="e.g. Technology, Finance, Biotech">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Official Website</label>
                <input type="text" [(ngModel)]="editProfile.website" name="website"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                  placeholder="https://example.com">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Organization Size</label>
                <select [(ngModel)]="editProfile.size" name="size"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500">
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="501-1000">501-1000 Employees</option>
                  <option value="1000+">1000+ Employees</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Founded Year</label>
                <input type="number" [(ngModel)]="editProfile.foundedYear" name="foundedYear"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                  placeholder="e.g. 2015">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">About Description</label>
              <textarea [(ngModel)]="editProfile.description" name="description" rows="4"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 resize-none"
                placeholder="Overview of the company products, work culture..."></textarea>
            </div>

            <button type="submit" [disabled]="isSavingProfile"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/10">
              {{ isSavingProfile ? 'Saving...' : 'Save Organization Details' }}
            </button>
          </form>
        </div>
      </div>

    </div>

    <!-- MODAL: SCHEDULE INTERVIEW -->
    <div *ngIf="showInterviewModal && selectedApplicant" class="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-6 backdrop-blur-sm">
      <div class="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-5 text-left text-slate-800">
        <h3 class="text-xl font-bold text-slate-900 font-display">Schedule Interview</h3>
        <p class="text-xs text-slate-500">Schedule interview for: <strong class="text-slate-800">{{selectedApplicant.candidateId?.userId?.fullName}}</strong></p>

        <!-- Form fields -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
            <input type="datetime-local" [(ngModel)]="interviewForm.scheduledAt"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 outline-none focus:border-brand-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interview Mode</label>
            <select [(ngModel)]="interviewForm.mode"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500">
              <option value="remote">Remote (Video Call)</option>
              <option value="phone">Phone Call</option>
              <option value="onsite">On-Site Interview</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location/Meet URL Link</label>
            <input type="text" [(ngModel)]="interviewForm.locationUrl"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
              placeholder="e.g. Google Meet link or physical address">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Special Instructions</label>
            <textarea [(ngModel)]="interviewForm.notes" rows="2"
              class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 resize-none"
              placeholder="Any details candidate should prepare..."></textarea>
          </div>
        </div>

        <p *ngIf="interviewError" class="text-xs text-red-600">{{interviewError}}</p>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button (click)="closeInterviewModal()" class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold">
            Cancel
          </button>
          <button (click)="submitInterview()" [disabled]="isScheduling"
            class="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-semibold">
            {{ isScheduling ? 'Scheduling...' : 'Confirm Schedule' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CompanyDashboardComponent implements OnInit {
  activeTab: 'postings' | 'create-job' | 'profile' = 'postings';
  
  companyProfile: any = null;
  jobsList: any[] = [];
  selectedJob: any = null;
  applicants: any[] = [];
  selectedApplicant: any = null;
  
  isApplicantsLoading = false;
  isPublishing = false;
  isSavingProfile = false;
  isUploadingLogo = false;
  isScheduling = false;
  
  applicantFilterStatus = '';
  skillsInput = '';
  logoSuccess = '';
  profileSuccess = false;
  profileError = '';
  
  newJob = {
    title: '',
    jobType: 'full-time',
    experienceLevel: 'mid',
    location: '',
    salaryMin: null,
    description: '',
    skills: [] as string[],
    requirements: [] as string[],
  };

  editProfile = {
    companyName: '',
    industry: '',
    website: '',
    size: '11-50',
    foundedYear: 2020,
    description: '',
  };

  // Interview modal state
  showInterviewModal = false;
  interviewError = '';
  interviewForm = {
    scheduledAt: '',
    mode: 'remote',
    locationUrl: '',
    notes: '',
  };

  constructor(
    private companyService: CompanyService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.fetchJobs();
  }

  fetchProfile(): void {
    this.companyService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.companyProfile = res.data;
          this.editProfile = {
            companyName: res.data.companyName || '',
            industry: res.data.industry || '',
            website: res.data.website || '',
            size: res.data.size || '11-50',
            foundedYear: res.data.foundedYear || 2020,
            description: res.data.description || '',
          };
        }
      },
    });
  }

  fetchJobs(): void {
    this.companyService.getProfile().subscribe({
      next: (profileRes) => {
        if (profileRes.success && profileRes.data) {
          this.companyProfile = profileRes.data;
          this.jobService.getJobs({ limit: 100 }).subscribe({
            next: (jobsRes) => {
              if (jobsRes.success && jobsRes.data) {
                // filter jobs belonging to this company
                this.jobsList = jobsRes.data.filter((j: any) => j.companyId?._id === this.companyProfile._id);
                if (this.jobsList.length > 0 && !this.selectedJob) {
                  this.selectJob(this.jobsList[0]);
                }
              }
            }
          });
        }
      }
    });
  }

  selectJob(job: any): void {
    this.selectedJob = job;
    this.fetchApplicants(job._id);
  }

  fetchApplicants(jobId: string): void {
    this.isApplicantsLoading = true;
    this.companyService.getApplicants(jobId, this.applicantFilterStatus).subscribe({
      next: (res) => {
        this.isApplicantsLoading = false;
        if (res.success && res.data) {
          this.applicants = res.data;
        }
      },
      error: () => {
        this.isApplicantsLoading = false;
      },
    });
  }

  archiveJob(jobId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to close this job posting? Candidates will no longer be able to apply.')) {
      this.jobService.archiveJob(jobId).subscribe({
        next: () => {
          this.fetchJobs();
        }
      });
    }
  }

  parseSkills(): void {
    this.newJob.skills = this.skillsInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
  }

  publishJob(): void {
    this.isPublishing = true;
    this.parseSkills();

    this.jobService.createJob(this.newJob).subscribe({
      next: (res) => {
        this.isPublishing = false;
        if (res.success) {
          this.activeTab = 'postings';
          this.fetchJobs();
          // Reset form
          this.newJob = {
            title: '',
            jobType: 'full-time',
            experienceLevel: 'mid',
            location: '',
            salaryMin: null,
            description: '',
            skills: [],
            requirements: [],
          };
          this.skillsInput = '';
        }
      },
      error: (err) => {
        this.isPublishing = false;
        alert(err.error?.message || 'Failed to publish job.');
      },
    });
  }

  saveProfile(): void {
    this.isSavingProfile = true;
    this.profileSuccess = false;
    this.profileError = '';

    this.companyService.updateProfile(this.editProfile).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        if (res.success) {
          this.profileSuccess = true;
          this.companyProfile = res.data;
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

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingLogo = true;
    this.logoSuccess = '';

    this.companyService.uploadLogo(file).subscribe({
      next: (res) => {
        this.isUploadingLogo = false;
        if (res.success) {
          this.logoSuccess = 'Logo updated successfully!';
          this.companyProfile.logoUrl = res.data.logoUrl;
        }
      },
      error: () => {
        this.isUploadingLogo = false;
      },
    });
  }

  updateStatus(app: any, event: any): void {
    const newStatus = event.target.value;
    const note = prompt(`Optional status change note for candidate:`);
    
    this.companyService.updateApplicationStatus(app._id, newStatus, note || undefined).subscribe({
      next: (res) => {
        if (res.success) {
          app.status = newStatus;
          this.fetchApplicants(this.selectedJob._id);
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Status transition invalid.');
        // Revert select input
        event.target.value = app.status;
      },
    });
  }

  openInterviewModal(applicant: any): void {
    this.selectedApplicant = applicant;
    this.showInterviewModal = true;
    this.interviewError = '';
    
    // Default form time to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    // Format to local ISO (YYYY-MM-DDTHH:MM)
    const tzoffset = tomorrow.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(tomorrow.getTime() - tzoffset)).toISOString().slice(0, 16);
    this.interviewForm.scheduledAt = localISOTime;
  }

  closeInterviewModal(): void {
    this.showInterviewModal = false;
    this.selectedApplicant = null;
  }

  submitInterview(): void {
    if (!this.interviewForm.scheduledAt || !this.interviewForm.locationUrl) {
      this.interviewError = 'Date and Location/Url are required.';
      return;
    }

    this.isScheduling = true;
    const payload = {
      applicationId: this.selectedApplicant._id,
      scheduledAt: new Date(this.interviewForm.scheduledAt).toISOString(),
      mode: this.interviewForm.mode,
      locationUrl: this.interviewForm.locationUrl,
      notes: this.interviewForm.notes,
    };

    this.companyService.scheduleInterview(payload).subscribe({
      next: (res) => {
        this.isScheduling = false;
        if (res.success) {
          this.closeInterviewModal();
          this.fetchApplicants(this.selectedJob._id);
        }
      },
      error: (err) => {
        this.isScheduling = false;
        this.interviewError = err.error?.message || 'Scheduling failed.';
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
        return 'bg-red-50 border border-red-100 text-red-655';
      default:
        return 'bg-slate-50 border border-slate-100 text-slate-600';
    }
  }
}
