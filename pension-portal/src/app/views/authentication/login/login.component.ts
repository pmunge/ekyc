import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { phoneNumber, password } = this.loginForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login(phoneNumber, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/authentication/otp');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Incorrect phone number or password.');
      }
    });
  }
}
