import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, FormControlDirective, FormSelectDirective } from '@coreui/angular';
import { finalize } from 'rxjs';
import { PROFILE_STATUSES } from '../../../core/models/profile';
import { ProfileService } from '../../../core/services/profiles.service';
@Component({ selector: 'app-profile-form', templateUrl: './form.component.html', styleUrl: './form.component.scss', imports: [ReactiveFormsModule, FormControlDirective, FormSelectDirective, ButtonDirective] })
export class ProfileFormComponent { private readonly fb = inject(FormBuilder); private readonly profileService = inject(ProfileService); @Output() cancelled = new EventEmitter<void>(); @Output() created = new EventEmitter<void>(); readonly saving = signal(false); readonly errorMessage = signal(''); readonly statuses = PROFILE_STATUSES; readonly form = this.fb.nonNullable.group({ name: ['', Validators.required], description: ['', Validators.required], status: ['Active', Validators.required] }); save(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving.set(true); this.profileService.createProfile(this.form.getRawValue()).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => this.created.emit(), error: () => this.errorMessage.set('The profile could not be created.') }); } }
export { ProfileFormComponent as FormComponent };
