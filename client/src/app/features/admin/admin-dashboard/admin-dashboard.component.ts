import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-10">
      
      <!-- Admin Panel Welcome -->
      <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900 font-display">Admin Control Center</h1>
          <p class="text-slate-500 mt-2 text-sm font-sans">Moderate companies, manage user status, edit skills taxonomy, and track platform metrics</p>
        </div>

        <!-- Tab Selector -->
        <div class="flex flex-wrap bg-white border border-slate-200 p-1.5 rounded-xl self-start gap-1 shadow-sm">
          <button (click)="changeTab('analytics')"
            [class.bg-brand-600]="activeTab === 'analytics'" [class.text-white]="activeTab === 'analytics'"
            [class.text-slate-500]="activeTab !== 'analytics'" [class.hover:text-slate-800]="activeTab !== 'analytics'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Analytics
          </button>
          <button (click)="changeTab('companies')"
            [class.bg-brand-600]="activeTab === 'companies'" [class.text-white]="activeTab === 'companies'"
            [class.text-slate-500]="activeTab !== 'companies'" [class.hover:text-slate-800]="activeTab !== 'companies'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3Z" />
            </svg>
            Verification Queue
          </button>
          <button (click)="changeTab('users')"
            [class.bg-brand-600]="activeTab === 'users'" [class.text-white]="activeTab === 'users'"
            [class.text-slate-500]="activeTab !== 'users'" [class.hover:text-slate-800]="activeTab !== 'users'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            User Management
          </button>
          <button (click)="changeTab('jobs')"
            [class.bg-brand-600]="activeTab === 'jobs'" [class.text-white]="activeTab === 'jobs'"
            [class.text-slate-500]="activeTab !== 'jobs'" [class.hover:text-slate-800]="activeTab !== 'jobs'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.453.25-.718.25H4.875a1.072 1.072 0 0 1-.718-.25m16.5 0a2.18 2.18 0 0 1-.75 1.661v3.586a1.682 1.682 0 0 1-.5 1.2l-3 3a1.682 1.682 0 0 1-1.2.5H6.875a1.682 1.682 0 0 1-1.2-.5l-3-3a1.682 1.682 0 0 1-.5-1.2V15.81" />
            </svg>
            Job Moderation
          </button>
          <button (click)="changeTab('taxonomy')"
            [class.bg-brand-600]="activeTab === 'taxonomy'" [class.text-white]="activeTab === 'taxonomy'"
            [class.text-slate-500]="activeTab !== 'taxonomy'" [class.hover:text-slate-800]="activeTab !== 'taxonomy'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.5 1.5 0 0 0 2.122 0l4.318-4.318a1.5 1.5 0 0 0 0-2.122L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
            Skills Taxonomy
          </button>
        </div>
      </div>

      <!-- TAB: ANALYTICS OVERVIEW -->
      <div *ngIf="activeTab === 'analytics'" class="space-y-8">
        <!-- Aggregated numbers grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6" *ngIf="stats">
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span class="text-xs font-semibold text-slate-450 uppercase tracking-wider block">Total Members</span>
            <strong class="text-3xl text-slate-900 font-display font-extrabold mt-2 block">{{stats.users.total}}</strong>
            <p class="text-xs text-slate-500 mt-1 font-medium">Candidates: {{stats.users.candidates}} &bull; Companies: {{stats.users.companies}}</p>
          </div>
          
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span class="text-xs font-semibold text-slate-450 uppercase tracking-wider block">Active Job Postings</span>
            <strong class="text-3xl text-slate-900 font-display font-extrabold mt-2 block">{{stats.jobs.active}}</strong>
            <p class="text-xs text-green-600 mt-1 font-semibold">Open for applications</p>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span class="text-xs font-semibold text-slate-450 uppercase tracking-wider block">Total Applications</span>
            <strong class="text-3xl text-slate-900 font-display font-extrabold mt-2 block">{{stats.applications.total}}</strong>
            <p class="text-xs text-slate-500 mt-1 font-medium font-medium">Last 7d: {{stats.applications.last7Days}} &bull; Last 30d: {{stats.applications.last30Days}}</p>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span class="text-xs font-semibold text-slate-450 uppercase tracking-wider block">Pending Verifications</span>
            <strong class="text-3xl text-slate-900 font-display font-extrabold mt-2 block" [class.text-amber-600]="stats.companies.pending > 0">{{stats.companies.pending}}</strong>
            <p class="text-xs text-slate-500 mt-1 font-medium">Companies awaiting review</p>
          </div>
        </div>

        <!-- Custom SVG Chart of applications growth -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm" *ngIf="stats">
          <h3 class="font-bold text-slate-900 text-lg mb-4">Platform Growth Trend</h3>
          <div class="h-48 flex items-end justify-between border-b border-slate-100 pb-2 pt-6">
            <div class="w-full flex justify-around items-end h-full relative">
              
              <!-- Simulated graph visual indicator -->
              <div class="absolute inset-0 flex items-center justify-center opacity-10">
                <span class="text-sm font-semibold tracking-wider text-slate-350 uppercase">JobConnect Metrics Visualizer</span>
              </div>

              <!-- Bar 1 -->
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 bg-brand-600 rounded-t-lg transition-all" [style.height.%]="20"></div>
                <span class="text-[10px] text-slate-450 font-semibold">Candidates</span>
              </div>
              <!-- Bar 2 -->
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 bg-indigo-600 rounded-t-lg transition-all" [style.height.%]="45"></div>
                <span class="text-[10px] text-slate-450 font-semibold">Active Jobs</span>
              </div>
              <!-- Bar 3 -->
              <div class="flex flex-col items-center gap-2">
                <div class="w-12 bg-purple-600 rounded-t-lg transition-all" [style.height.%]="80"></div>
                <span class="text-[10px] text-slate-450 font-semibold">Applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: COMPANIES VERIFICATION QUEUE -->
      <div *ngIf="activeTab === 'companies'" class="space-y-6">
        <h2 class="text-xl font-bold text-slate-900">Pending Verification Queue</h2>
        
        <div *ngIf="pendingCompanies.length === 0" class="py-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm shadow-sm">
          No pending registrations. All companies are verified!
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngFor="let company of pendingCompanies" class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h3 class="text-slate-900 font-bold text-lg">{{company.companyName}}</h3>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">Admin Contact: {{company.userId?.fullName}} ({{company.userId?.email}})</p>
              </div>
              <span class="px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-705 text-[10px] font-bold uppercase tracking-wider rounded">PENDING</span>
            </div>

            <p class="text-slate-600 text-xs leading-relaxed">{{company.description || 'No description provided.'}}</p>
            
            <div class="text-xs space-y-1.5 text-slate-500">
              <p class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v18H3V3Z" />
                </svg>
                <strong>Industry:</strong> {{company.industry}}
              </p>
              <p class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <strong>Staff Size:</strong> {{company.size}}
              </p>
              <p *ngIf="company.website" class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-slate-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <strong>Website:</strong> <a [href]="company.website" target="_blank" class="text-brand-600 hover:underline">{{company.website}}</a>
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button (click)="verifyCompany(company._id, 'rejected')" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-red-600 rounded-xl text-xs font-semibold">
                Reject
              </button>
              <button (click)="verifyCompany(company._id, 'verified')" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold">
                Verify Organization
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: USER MANAGEMENT -->
      <div *ngIf="activeTab === 'users'" class="space-y-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 class="text-xl font-bold text-slate-900">Users Moderation</h2>
          <div class="flex items-center gap-3">
            <input type="text" [(ngModel)]="userSearch" (ngModelChange)="fetchUsers()"
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
              placeholder="Search by name, email...">
            
            <select [(ngModel)]="userRoleFilter" (ngModelChange)="fetchUsers()"
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500">
              <option value="">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="company">Companies</option>
            </select>
          </div>
        </div>

        <!-- Table list of users -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <th class="py-3 px-4">Full Name</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Joined Date</th>
                <th class="py-3 px-4">Verification</th>
                <th class="py-3 px-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let user of usersList" class="hover:bg-slate-50/50 text-slate-700">
                <td class="py-3.5 px-4 font-semibold text-slate-900">{{user.fullName}}</td>
                <td class="py-3.5 px-4 font-medium">{{user.email}}</td>
                <td class="py-3.5 px-4">
                  <span [ngClass]="{'bg-blue-50 border border-blue-100 text-blue-600': user.role === 'candidate', 'bg-purple-50 border border-purple-100 text-purple-600': user.role === 'company', 'bg-amber-50 border border-amber-100 text-amber-700': user.role === 'admin'}"
                    class="px-2 py-0.5 rounded text-[10px] font-bold">
                    {{user.role | uppercase}}
                  </span>
                </td>
                <td class="py-3.5 px-4">{{user.createdAt | date:'shortDate'}}</td>
                <td class="py-3.5 px-4">
                  <span *ngIf="user.isVerified" class="text-green-600 font-semibold">Verified</span>
                  <span *ngIf="!user.isVerified" class="text-slate-400">Unverified</span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button *ngIf="user.role !== 'admin'" (click)="toggleSuspension(user)"
                    [class.text-green-605]="user.isSuspended" [class.text-red-650]="!user.isSuspended"
                    class="hover:underline font-bold text-[11px]">
                    {{ user.isSuspended ? 'Reactivate' : 'Suspend' }}
                  </button>
                  <span *ngIf="user.role === 'admin'" class="text-slate-400">Protected</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: JOB MODERATION -->
      <div *ngIf="activeTab === 'jobs'" class="space-y-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <h2 class="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Moderate Postings</h2>
        
        <div class="space-y-4">
          <div *ngFor="let job of jobsList" class="p-5 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-slate-900 font-bold text-base">{{job.title}}</h3>
                <span [ngClass]="{'bg-green-50 border border-green-100 text-green-600': job.status === 'active', 'bg-red-50 border border-red-100 text-red-650': job.status === 'closed'}"
                  class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  {{job.status}}
                </span>
              </div>
              <p class="text-slate-500 text-xs mt-1">Company: {{job.companyId?.companyName}} &bull; Location: {{job.location}}</p>
            </div>

            <div class="flex items-center gap-2 justify-end" *ngIf="job.status === 'active'">
              <button (click)="closeViolationJob(job._id)" class="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold">
                Force Close (Policy Violation)
              </button>
            </div>
            <div *ngIf="job.status === 'closed'">
              <span class="text-xs text-slate-400">No Action Required</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: TAXONOMY EDIT -->
      <div *ngIf="activeTab === 'taxonomy'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Add skills card -->
        <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 class="font-bold text-slate-900 text-base">Add New Skill/Category</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Taxonomy Name</label>
              <input type="text" [(ngModel)]="newTaxonomy.name"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500"
                placeholder="e.g. Node.js or Design">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</label>
              <select [(ngModel)]="newTaxonomy.type"
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-brand-500">
                <option value="skill">Skill</option>
                <option value="category">Category</option>
              </select>
            </div>

            <button (click)="createTaxonomy()"
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-brand-500/10">
              Add Taxonomy
            </button>
          </div>
        </div>

        <!-- List taxonomy items -->
        <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-lg">Taxonomy Master List</h3>
            
            <div class="flex bg-slate-50 border border-slate-200 p-1 rounded-lg">
              <button (click)="taxonomyFilterType = ''" [class.bg-brand-600]="taxonomyFilterType === ''" [class.text-white]="taxonomyFilterType === ''" [class.text-slate-500]="taxonomyFilterType !== ''" class="px-3 py-1 rounded text-[10px] font-bold hover:text-slate-800">All</button>
              <button (click)="taxonomyFilterType = 'skill'" [class.bg-brand-600]="taxonomyFilterType === 'skill'" [class.text-white]="taxonomyFilterType === 'skill'" [class.text-slate-500]="taxonomyFilterType !== 'skill'" class="px-3 py-1 rounded text-[10px] font-bold hover:text-slate-800">Skills</button>
              <button (click)="taxonomyFilterType = 'category'" [class.bg-brand-600]="taxonomyFilterType === 'category'" [class.text-white]="taxonomyFilterType === 'category'" [class.text-slate-500]="taxonomyFilterType !== 'category'" class="px-3 py-1 rounded text-[10px] font-bold hover:text-slate-800">Categories</button>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 max-h-96 overflow-y-auto pt-2">
            <div *ngFor="let item of getFilteredTaxonomy()" class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-slate-50 border border-slate-150 text-xs">
              <span class="text-slate-700 font-medium">{{item.name}}</span>
              <span [ngClass]="{'bg-blue-50 border border-blue-100 text-blue-600': item.type === 'skill', 'bg-purple-50 border border-purple-100 text-purple-600': item.type === 'category'}"
                class="px-1.5 py-0.5 rounded text-[8px] font-bold">
                {{item.type}}
              </span>
              <button (click)="deleteTaxonomy(item._id)" class="text-red-600 hover:text-red-750 font-bold ml-1 text-sm">&times;</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'analytics' | 'companies' | 'users' | 'jobs' | 'taxonomy' = 'analytics';
  
  stats: any = null;
  pendingCompanies: any[] = [];
  usersList: any[] = [];
  jobsList: any[] = [];
  taxonomyItems: any[] = [];

  // Filter states
  userSearch = '';
  userRoleFilter = '';
  taxonomyFilterType: '' | 'skill' | 'category' = '';

  newTaxonomy = {
    name: '',
    type: 'skill' as 'skill' | 'category',
  };

  constructor(
    private adminService: AdminService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  changeTab(tab: 'analytics' | 'companies' | 'users' | 'jobs' | 'taxonomy'): void {
    this.activeTab = tab;
    if (tab === 'analytics') this.fetchAnalytics();
    else if (tab === 'companies') this.fetchPendingCompanies();
    else if (tab === 'users') this.fetchUsers();
    else if (tab === 'jobs') this.fetchJobs();
    else if (tab === 'taxonomy') this.fetchTaxonomy();
  }

  fetchAnalytics(): void {
    this.adminService.getAnalytics().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        }
      },
    });
  }

  fetchPendingCompanies(): void {
    this.adminService.getPendingCompanies().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.pendingCompanies = res.data;
        }
      },
    });
  }

  verifyCompany(companyId: string, status: 'verified' | 'rejected'): void {
    let reason = '';
    if (status === 'rejected') {
      reason = prompt('Enter reason for profile rejection:') || 'Information was insufficient.';
    }

    this.adminService.verifyCompany(companyId, status, reason || undefined).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchPendingCompanies();
        }
      },
    });
  }

  fetchUsers(): void {
    const filters = {
      q: this.userSearch,
      role: this.userRoleFilter,
    };
    this.adminService.listUsers(filters).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.usersList = res.data;
        }
      },
    });
  }

  toggleSuspension(user: any): void {
    const nextSuspended = !user.isSuspended;
    if (confirm(`Are you sure you want to ${nextSuspended ? 'suspend' : 'reactivate'} user account ${user.email}?`)) {
      this.adminService.toggleUserSuspension(user._id, nextSuspended).subscribe({
        next: (res) => {
          if (res.success) {
            user.isSuspended = nextSuspended;
          }
        },
      });
    }
  }

  fetchJobs(): void {
    this.adminService.listJobs().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.jobsList = res.data;
        }
      },
    });
  }

  closeViolationJob(jobId: string): void {
    if (confirm('Are you sure you want to force close this job listing? It will notify the company admin.')) {
      this.adminService.moderateJob(jobId, 'closed').subscribe({
        next: () => {
          this.fetchJobs();
        },
      });
    }
  }

  fetchTaxonomy(): void {
    this.jobService.getTaxonomy().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.taxonomyItems = res.data;
        }
      },
    });
  }

  getFilteredTaxonomy(): any[] {
    if (!this.taxonomyFilterType) return this.taxonomyItems;
    return this.taxonomyItems.filter((i) => i.type === this.taxonomyFilterType);
  }

  createTaxonomy(): void {
    if (!this.newTaxonomy.name) return;

    this.adminService.createTaxonomy(this.newTaxonomy.name, this.newTaxonomy.type).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchTaxonomy();
          this.newTaxonomy.name = '';
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Taxonomy item already exists.');
      },
    });
  }

  deleteTaxonomy(id: string): void {
    if (confirm('Delete this taxonomy label? It will be removed from filters.')) {
      this.adminService.deleteTaxonomy(id).subscribe({
        next: () => {
          this.fetchTaxonomy();
        },
      });
    }
  }
}
