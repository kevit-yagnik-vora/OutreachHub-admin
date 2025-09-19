import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { CreateWorkspaceComponent } from './pages/create-workspace/create-workspace.component';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';

const routes: Routes = [
  {
    // The main page at '/workspace' will show the list
    path: 'my',
    component: WorkspaceListComponent,
  },
  {
    path: 'all',
    component: WorkspaceListComponent,
  },
  {
    // The page for adding a new workspace
    path: 'create',
    component: CreateWorkspaceComponent,
  },
  {
    // The new detail route with a dynamic ':id' parameter
    path: ':id',
    component: WorkspaceDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
