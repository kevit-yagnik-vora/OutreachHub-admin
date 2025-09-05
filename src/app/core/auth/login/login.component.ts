import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        console.log('Login successful! User:', user);
        // Redirection is handled by the service.
        this.router.navigate(['']);
      this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSubmitting = false;
      },
    });
  }
}
