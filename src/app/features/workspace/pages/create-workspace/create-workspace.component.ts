import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../../workspace.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent implements OnInit {
  workspaceForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.workspaceForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.maxLength(200)]],
    });
  }

  // Helper for easy access to form controls in the template
  get formControls() {
    return this.workspaceForm.controls;
  }

  onSubmit(): void {
    if (this.workspaceForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.workspaceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.workspaceService.createWorkspace(this.workspaceForm.value).subscribe({
      next: (response) => {
        console.log('Workspace created successfully!', response);
        // On success, navigate back to the workspace list
        this.router.navigate(['/workspace']);
      },
      error: (err) => {
        this.error = 'Failed to create workspace. Please try again.';
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }
}
