import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppNotification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Signal for unread count
  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getUnreadCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unread-count`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.unreadCount.set(res.data.count);
        }
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap((res) => {
        if (res.success) {
          this.unreadCount.update(count => Math.max(0, count - 1));
        }
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap((res) => {
        if (res.success) {
          this.unreadCount.set(0);
        }
      })
    );
  }
}
