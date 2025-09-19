import { Component } from '@angular/core';
import {
  Workspace,
  WorkspaceOwner,
} from '../../../../core/models/workspace.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  WorkspaceDetailResponse,
  WorkspaceService,
} from '../../workspace.service';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html',
  styleUrl: './workspace-detail.component.scss',
})
export class WorkspaceDetailComponent {
  workspace: Workspace | null = null;
  users: WorkspaceOwner[] = [];
  isLoading = true;
  error: string | null = null;

  notifications: Array<{ message: string; type: 'success' | 'error' }> = [];

  isAddUserModalVisible = false;
  isEditModalVisible = false;
  isConfirmRemoveModalVisible = false;
  isChangeRoleModalVisible = false;

  userToManage: WorkspaceOwner | null = null;
  userToRemove: WorkspaceOwner | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.fetchWorkspaceDetails(id);
    } else {
      this.router.navigate(['/workspace']);
    }
  }

  fetchWorkspaceDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.workspaceService.getWorkspaceById(id).subscribe({
      next: (response: WorkspaceDetailResponse) => {
        this.workspace = response.workspace;
        this.users = response.users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load workspace details. It may not exist.';
        this.isLoading = false;
      },
    });
  }

  handleUserAdded(notification: {
    message: string;
    type: 'success' | 'error';
  }): void {
    this.isAddUserModalVisible = false;
    this.addNotification(notification.message, notification.type);
    if (this.workspace) {
      this.fetchWorkspaceDetails(this.workspace._id);
    }
  }

  handleNotification(notification: {
    message: string;
    type: 'success' | 'error';
  }): void {
    this.isAddUserModalVisible = false;
    this.isEditModalVisible = false;
    this.isChangeRoleModalVisible = false;

    this.addNotification(notification.message, notification.type);
    if (this.workspace) {
      this.fetchWorkspaceDetails(this.workspace._id);
    }
  }

  addNotification(message: string, type: 'success' | 'error'): void {
    this.notifications.push({ message, type });
    setTimeout(() => {
      this.notifications.shift();
    }, 2000);
  }

  openChangeRoleModal(user: WorkspaceOwner): void {
    this.userToManage = user;
    this.isChangeRoleModalVisible = true;
  }

  openConfirmRemoveModal(user: WorkspaceOwner): void {
    this.userToRemove = user;
    this.userToManage = user;
    this.isConfirmRemoveModalVisible = true;
  }

  handleRemoveUserConfirm(): void {
    if (!this.userToManage || !this.workspace) return;
    this.workspaceService
      .removeUserFromWorkspace(this.workspace._id, this.userToManage._id)
      .subscribe({
        next: () => {
          this.addNotification(
            `Successfully removed ${this.userToRemove?.name}.`,
            'success'
          );
          this.fetchWorkspaceDetails(this.workspace!._id);
        },
        error: (err) => {
          this.addNotification('Failed to remove user.', 'error');
          console.error(err);
        },
        complete: () => {
          this.isConfirmRemoveModalVisible = false;
          this.userToManage = null;
        },
      });
  }
}
