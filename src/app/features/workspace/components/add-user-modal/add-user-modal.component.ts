import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkspaceService } from '../../workspace.service';

type ModalView = 'ADD_EXISTING' | 'CONFIRM_CREATE' | 'CREATE_NEW';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  @Input() workspaceId!: string;
  @Output() closeModal = new EventEmitter<void>();
  @Output() notification = new EventEmitter<{
    message: string;
    type: 'success' | 'error';
  }>();

  addUserForm!: FormGroup;
  isSubmitting = false;
  apiError: string | null = null;
  currentView: ModalView = 'ADD_EXISTING';

  constructor(
    private fb: FormBuilder,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['Viewer', [Validators.required]],
      // THE FIX #1: Initialize name and phoneNumber without validators.
      // They are not required in the initial 'ADD_EXISTING' view.
      name: [''],
      phoneNumber: [''],
    });
  }

  onSubmit(): void {
    // This logic is already correct and does not need to change.
    if (this.currentView === 'ADD_EXISTING') {
      if (
        this.addUserForm.get('email')?.invalid ||
        this.addUserForm.get('role')?.invalid
      ) {
        return;
      }
      this.submitAddExisting();
    } else if (this.currentView === 'CREATE_NEW') {
      if (this.addUserForm.invalid) {
        this.addUserForm.markAllAsTouched();
        return;
      }
      this.submitCreateNew();
    }
  }

  private submitAddExisting(): void {
    this.isSubmitting = true;
    this.apiError = null;
    const { email, role } = this.addUserForm.value;

    this.workspaceService
      .addUserToWorkspace(this.workspaceId, { email, role })
      .subscribe({
        next: () => {
          this.notification.emit({
            message: `Successfully added ${email} to the workspace.`,
            type: 'success',
          });
          this.closeModal.emit();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.currentView = 'CONFIRM_CREATE';
          } else {
            this.apiError = err.error.message || 'An unknown error occurred.';
          }
          this.isSubmitting = false;
        },
      });
  }

  private submitCreateNew(): void {
    this.isSubmitting = true;
    this.apiError = null;

    this.workspaceService
      .addUserToWorkspace(this.workspaceId, this.addUserForm.value)
      .subscribe({
        next: () => {
          this.notification.emit({
            message: `Successfully created and invited ${this.addUserForm.value.email}.`,
            type: 'success',
          });
          this.closeModal.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.apiError = err.error.message || 'An unknown error occurred.';
          this.isSubmitting = false;
        },
      });
  }

  confirmAndProceedToCreate(): void {
    // THE FIX #2: When switching views, dynamically add the required validators.
    const nameControl = this.addUserForm.get('name');
    const phoneControl = this.addUserForm.get('phoneNumber');

    nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
    phoneControl?.setValidators([
      Validators.required,
      Validators.minLength(10),
    ]);

    // Update the validity of the controls to apply the new validators.
    nameControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();

    this.currentView = 'CREATE_NEW';
    this.apiError = null;
  }
}
