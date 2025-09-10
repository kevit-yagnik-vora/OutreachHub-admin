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

  isAddUserModalVisible = false;
  notifications: Array<{ message: string; type: 'success' | 'error' }> = [];

  isEditModalVisible = false;
  isConfirmRemoveModalVisible = false;
  isChangeRoleModalVisible = false; // <-- New state for the new modal
  userToManage: WorkspaceOwner | null = null; // A generic property to hold the user being acted upon

  userToRemove: WorkspaceOwner | null = null; // Store user to be removed

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    // Get the workspace ID from the URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.fetchWorkspaceDetails(id);
    } else {
      // If no ID is present, something is wrong, go back to the list
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

  // This method now receives the notification object from the modal
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
    this.isChangeRoleModalVisible = false; // <-- Close the new modal

    this.addNotification(notification.message, notification.type);
    if (this.workspace) {
      this.fetchWorkspaceDetails(this.workspace._id);
    }
  }

  // A helper method to show and then hide notifications
  addNotification(message: string, type: 'success' | 'error'): void {
    this.notifications.push({ message, type });
    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      this.notifications.shift();
    }, 2000);
  }

  openChangeRoleModal(user: WorkspaceOwner): void {
    this.userToManage = user;
    this.isChangeRoleModalVisible = true;
  }

  // Open the confirmation modal and store the user
  openConfirmRemoveModal(user: WorkspaceOwner): void {
    this.userToRemove = user;
    this.userToManage = user;
    this.isConfirmRemoveModalVisible = true;
  }

  handleRemoveUserConfirm(): void {
    // if (!this.userToRemove || !this.workspace) {
    //   return;
    // }

    // this.workspaceService
    //   .removeUserFromWorkspace(this.workspace._id, this.userToRemove._id)
    //   .subscribe({
    //     next: () => {
    //       this.addNotification(
    //         `Successfully removed ${this.userToRemove?.name}.`,
    //         'success'
    //       );
    //       this.fetchWorkspaceDetails(this.workspace!._id); // Refresh data
    //     },
    //     error: (err) => {
    //       this.addNotification('Failed to remove user.', 'error');
    //       console.error(err);
    //     },
    //     complete: () => {
    //       // Close modal and clear selected user regardless of outcome
    //       this.isConfirmRemoveModalVisible = false;
    //       this.userToRemove = null;
    //     },
    //   });

    if (!this.userToManage || !this.workspace) return;
    // Use this.userToManage instead of this.userToRemove
    this.workspaceService
      .removeUserFromWorkspace(this.workspace._id, this.userToManage._id)
      .subscribe({
        // ...
        complete: () => {
          this.isConfirmRemoveModalVisible = false;
          this.userToManage = null; // Clear the selected user
        },
      });
  }
}
