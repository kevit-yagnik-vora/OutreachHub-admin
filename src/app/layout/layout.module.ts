import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { FooterComponent } from './partials/footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    // We only need to export the top-level layout components
    AuthLayoutComponent,
    MainLayoutComponent,
  ],
})
export class LayoutModule {}
