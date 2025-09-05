import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'OutreachHub Admin';
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    // Expose the isLoggedIn observable to the template
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }
}
