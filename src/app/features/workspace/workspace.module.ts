import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { CreateWorkspaceComponent } from './pages/create-workspace/create-workspace.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';
import { AddUserModalComponent } from './components/add-user-modal/add-user-modal.component';


@NgModule({
  declarations: [
    WorkspaceListComponent,
    CreateWorkspaceComponent,
    WorkspaceDetailComponent,
    AddUserModalComponent
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule
  ]
})
export class WorkspaceModule { }
