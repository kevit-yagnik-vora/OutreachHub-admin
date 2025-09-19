import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { CreateWorkspaceComponent } from './pages/create-workspace/create-workspace.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';
import { AddUserModalComponent } from './components/add-user-modal/add-user-modal.component';
import { EditWorkspaceModalComponent } from './components/edit-workspace-modal/edit-workspace-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { ChangeRoleModalComponent } from './components/change-role-modal/change-role-modal.component';

@NgModule({
  declarations: [
    WorkspaceListComponent,
    CreateWorkspaceComponent,
    WorkspaceDetailComponent,
    AddUserModalComponent,
    EditWorkspaceModalComponent,
    ChangeRoleModalComponent,
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
})
export class WorkspaceModule {}
