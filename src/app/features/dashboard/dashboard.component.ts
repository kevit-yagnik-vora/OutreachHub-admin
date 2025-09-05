import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import User from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';
  currentDate: Date = new Date();
  greeting: string = ''; // <-- ADD property for the dynamic greeting

  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setGreeting(); // <-- CALL the new method on initialization

    this.userSubscription = this.authService.currentUser$.subscribe(
      (user: User | null) => {
        if (user) {
          this.userName = user.name;
        }
      }
    );
  }

  private setGreeting(): void {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  ngOnDestroy(): void {
    // Prevent memory leaks by unsubscribing
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
