import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import User from '../../core/models/user.model';

// --- Interfaces for Workspace & User Data ---
interface KpiCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
}

interface WorkspaceReport {
  name: string;
  totalCampaigns: number;
  totalUsers: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName: string = 'User';
  greeting: string = '';
  private userSubscription: Subscription | undefined;

  // --- Data Properties ---
  kpiData: KpiCard[] = [];
  // workspaces: Workspace[] = [];
  workspaces: WorkspaceReport[] = []; // Using the workspaces array again

  // --- Doughnut Chart Configuration ---
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // THE FIX: Add a comment to ignore the TypeScript error on the next line.
    // This is a known issue with the typings for this library version.
    // @ts-ignore
    cutout: '70%', // Makes the doughnut thinner and more modern
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#64748b',
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1e293b',
        titleColor: '#cbd5e1',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 6,
      },
    },
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadDummyData();

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
    if (currentHour < 12) this.greeting = 'Good Morning';
    else if (currentHour < 17) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  private loadDummyData(): void {
    this.kpiData = [
      {
        title: 'Total Workspaces',
        value: '12',
        change: '+2',
        changeType: 'increase',
        icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      },
      {
        title: 'Total Users',
        value: '1,204',
        change: '+12.5%',
        changeType: 'increase',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      },
      {
        title: 'Avg. Users / Workspace',
        value: '100',
        change: '+10',
        changeType: 'increase',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      },
      {
        title: 'Pending Invites',
        value: '16',
        change: '+3',
        changeType: 'increase',
        icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      },
    ];

    this.workspaces = [
      { name: 'Q1 Marketing Blitz', totalCampaigns: 5, totalUsers: 20 },
      { name: 'Enterprise Sales', totalCampaigns: 2, totalUsers: 10 },
      { name: 'Product Launch', totalCampaigns: 8, totalUsers: 25 },
      { name: 'Social Media Outreach', totalCampaigns: 12, totalUsers: 15 },
    ];

    this.doughnutChartData = {
      labels: this.workspaces.map((ws) => ws.name),
      datasets: [
        {
          data: this.workspaces.map((ws) => ws.totalUsers),
          backgroundColor: [
            '#4f46e5',
            '#10b981',
            '#f59e0b',
            '#3b82f6',
            '#6b7280',
          ],
          hoverBackgroundColor: [
            '#6366f1',
            '#34d399',
            '#fbbf24',
            '#60a5fa',
            '#7f8794',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
