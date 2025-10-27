import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [CommonModule, DashboardRoutingModule, NgChartsModule,DashboardComponent],
})
export class DashboardModule {}
