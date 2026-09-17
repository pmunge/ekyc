import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, FormControlDirective, FormSelectDirective, SpinnerComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { PensionsService } from '../../../core/services/pensions.service';

@Component({
  selector: 'app-pensioner-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  imports: [ReactiveFormsModule, FormControlDirective, FormSelectDirective, ButtonDirective, SpinnerComponent],
})
export class PensionerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pensionsService = inject(PensionsService);

  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  readonly titleOptions = ['MR', 'MRS', 'MISS', 'MS', 'DR', 'PROF', 'REV'];

  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly photoBase64 = signal('');

  readonly pensionerForm = this.fb.nonNullable.group({
    title: ['MR', Validators.required],
    firstName: ['', Validators.required],
    otherNames: ['', Validators.required],
    nationalId: ['', Validators.required],
    kraPin: [''],
    dateOfBirth: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    pensionNumber: ['', Validators.required],
    bankName: ['', Validators.required],
    accountHolderName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    mpesaNumber: ['', Validators.required],
    password: ['', Validators.required],
    pin: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.photoBase64.set('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.photoBase64.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.pensionerForm.invalid) {
      this.pensionerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.saving.set(true);

    this.pensionsService
      .createPensioner({ ...this.pensionerForm.getRawValue(), photoBase64: this.photoBase64() })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.created.emit(),
        error: () => this.errorMessage.set('The pensioner could not be added. Please try again.'),
      });
  }
}

export { PensionerFormComponent as FormComponent };
