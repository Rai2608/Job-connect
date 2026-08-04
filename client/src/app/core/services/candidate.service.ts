import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidate`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData);
  }

  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post<any>(`${this.apiUrl}/profile/resume`, formData);
  }

  getApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications`);
  }

  toggleSaveJob(jobId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saved-jobs`, { jobId });
  }

  getSavedJobs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/saved-jobs`);
  }
}
