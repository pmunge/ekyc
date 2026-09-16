import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.scss',
})
export class Otp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly maskedPhoneNumber = computed(() => {
    const phoneNumber = this.auth.getPendingPhoneNumber();
    if (!phoneNumber) {
      return '';
    }
    return phoneNumber.length > 4
      ? `${'*'.repeat(phoneNumber.length - 4)}${phoneNumber.slice(-4)}`
      : phoneNumber;
  });

  otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{4,8}$/)]],
  });

  constructor() {
    // Reached without completing the password step → back to login.
    if (!this.auth.hasPendingLogin()) {
      this.router.navigateByUrl('/authentication/login');
    }
  }

  submit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { code } = this.otpForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.verifyOtp(code).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.message || 'That code is invalid or has expired. Please try again.'
        );
      },
    });
  }

  cancel(): void {
    this.auth.logout();
    this.router.navigateByUrl('/authentication/login');
  }
}
