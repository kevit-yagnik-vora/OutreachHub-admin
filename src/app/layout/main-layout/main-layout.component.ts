import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  isSidebarVisible = false;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  onSidebarLinkClicked(): void {
    if (this.isSidebarVisible) {
      this.isSidebarVisible = false;
    }
  }
}
