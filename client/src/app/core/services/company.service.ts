import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/company`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData);
  }

  uploadLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', file);
    return this.http.post<any>(`${this.apiUrl}/profile/logo`, formData);
  }

  getApplicants(jobId: string, status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any>(`${this.apiUrl}/jobs/${jobId}/applicants`, { params });
  }

  updateApplicationStatus(applicationId: string, status: string, notes?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/applications/${applicationId}/status`, { status, notes });
  }

  scheduleInterview(interviewData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/interviews`, interviewData);
  }
}
