import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Company moderation
  getPendingCompanies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies/pending`);
  }

  verifyCompany(companyId: string, status: 'verified' | 'rejected', rejectionReason?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/companies/${companyId}/verify`, { status, rejectionReason });
  }

  // User moderation
  listUsers(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<any>(`${this.apiUrl}/users`, { params });
  }

  toggleUserSuspension(userId: string, isSuspended: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/suspend`, { isSuspended });
  }

  // Job moderation
  listJobs(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<any>(`${this.apiUrl}/jobs`, { params });
  }

  moderateJob(jobId: string, status: 'active' | 'closed'): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${jobId}/moderate`, { status });
  }

  // Taxonomy CRUD
  createTaxonomy(name: string, type: 'skill' | 'category'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/taxonomy`, { name, type });
  }

  deleteTaxonomy(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/taxonomy/${id}`);
  }

  // Dashboard Analytics
  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }
}
