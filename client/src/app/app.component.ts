import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { NotificationService, AppNotification } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'JobConnect';
  showUserDropdown = false;
  showNotifications = false;
  notifications: AppNotification[] = [];

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.fetchUnreadCount();
    }
  }

  fetchUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe();
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserDropdown = false;
    if (this.showNotifications) {
      this.fetchNotifications();
    }
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.notifications = res.data;
        }
      }
    });
  }

  readNotification(notif: AppNotification): void {
    if (!notif.isRead) {
      this.notificationService.markAsRead(notif._id).subscribe({
        next: () => {
          notif.isRead = true;
          this.fetchUnreadCount();
        }
      });
    }
  }

  markAllNotificationsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.fetchUnreadCount();
      }
    });
  }

  getDashboardRoute(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'candidate') return '/candidate/dashboard';
    if (role === 'company') return '/company/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/';
  }

  logout(): void {
    this.showUserDropdown = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
