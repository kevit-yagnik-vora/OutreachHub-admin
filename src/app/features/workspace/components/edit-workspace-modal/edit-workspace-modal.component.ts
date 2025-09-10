import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workspace } from '../../../../core/models/workspace.model';
import { WorkspaceService } from '../../workspace.service';

@Component({
  selector: 'app-edit-workspace-modal',
  templateUrl: './edit-workspace-modal.component.html',
  styleUrls: ['./edit-workspace-modal.component.scss'],
})
export class EditWorkspaceModalComponent implements OnInit {
  @Input() workspace!: Workspace; // Receive the full workspace object from the parent
  @Output() closeModal = new EventEmitter<void>();
  @Output() notification = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();

  editForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [
        this.workspace.name,
        [Validators.required, Validators.minLength(3)],
      ],
      description: [this.workspace.description, [Validators.maxLength(200)]],
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.error = null;

    this.workspaceService
      .updateWorkspace(this.workspace._id, this.editForm.value)
      .subscribe({
        next: () => {
          this.notification.emit({
            message: 'Workspace updated successfully.',
            type: 'success',
          });
          this.closeModal.emit(); // This will trigger the parent to refresh
        },
        error: (err) => {
          this.error = err.error.message || 'Failed to update workspace.';
          this.isSubmitting = false;
          console.error(err);
        },
      });
  }
}
