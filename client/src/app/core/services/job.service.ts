import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<any>(this.apiUrl, { params });
  }

  getJobById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }

  updateJob(id: string, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, jobData);
  }

  archiveJob(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  applyToJob(jobId: string, coverNote: string = ''): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/apply`, { jobId, coverNote });
  }

  getTaxonomy(type?: 'skill' | 'category'): Observable<any> {
    const url = type ? `${environment.apiUrl}/taxonomy?type=${type}` : `${environment.apiUrl}/taxonomy`;
    return this.http.get<any>(url);
  }
}
