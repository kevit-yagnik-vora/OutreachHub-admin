import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkspaceOwner } from '../../../../core/models/workspace.model';
import { WorkspaceService } from '../../workspace.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-role-modal',
  templateUrl: './change-role-modal.component.html',
  styleUrls: ['./change-role-modal.component.scss'],
})
export class ChangeRoleModalComponent implements OnInit {
  @Input() user!: WorkspaceOwner;
  @Input() workspaceId!: string;

  @Output() closeModal = new EventEmitter<void>();
  @Output() notification = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();

  selectedRole: 'Editor' | 'Viewer';
  isSubmitting = false;

  constructor(private workspaceService: WorkspaceService) {
    this.selectedRole = 'Viewer';
  }

  ngOnInit(): void {
    if (this.user && this.user.role) {
      this.selectedRole = this.user.role as 'Editor' | 'Viewer';
    }
  }

  onConfirm(): void {
    if (this.selectedRole === this.user.role) {
      this.closeModal.emit();
      return;
    }

    this.isSubmitting = true;

    this.workspaceService
      .updateUserRole(this.workspaceId, this.user._id, this.selectedRole)
      .subscribe({
        next: () => {
          this.notification.emit({
            message: `Role for ${this.user.name} updated to ${this.selectedRole}.`,
            type: 'success',
          });
          this.closeModal.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.notification.emit({
            message:
              err.error.message ||
              `Failed to update role for ${this.user.name}.`,
            type: 'error',
          });
          this.isSubmitting = false;
        },
      });
  }
}
