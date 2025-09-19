import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { CreateWorkspaceComponent } from './pages/create-workspace/create-workspace.component';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';

const routes: Routes = [
  {
    path: 'my',
    component: WorkspaceListComponent,
  },
  {
    path: 'all',
    component: WorkspaceListComponent,
  },
  {
    path: 'create',
    component: CreateWorkspaceComponent,
  },
  {
    path: ':id',
    component: WorkspaceDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
