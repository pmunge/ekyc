import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonDirective, FormControlDirective, FormSelectDirective, SpinnerComponent } from '@coreui/angular';
import { finalize } from 'rxjs';
import { Profile } from '../../../core/models/profile';
import { ProfileService } from '../../../core/services/profiles.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-form', templateUrl: './form.component.html', styleUrl: './form.component.scss',
  imports: [ReactiveFormsModule, FormControlDirective, FormSelectDirective, ButtonDirective, SpinnerComponent],
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly usersService = inject(UsersService);
  @Output() cancelled = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();
  readonly profiles = signal<Profile[]>([]);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly usersForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]], firstName: ['', Validators.required],
    middleName: [''], surName: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''], idNumber: [''], county: [''], profileId: ['', Validators.required],
  });
  ngOnInit(): void {
    this.profileService.getProfiles().subscribe({
      next: (profiles) => this.profiles.set(profiles),
      error: () => this.errorMessage.set('Profiles could not be loaded. Please try again.'),
    });
  }
  save(): void {
    if (this.usersForm.invalid) { this.usersForm.markAllAsTouched(); return; }
    this.errorMessage.set(''); this.saving.set(true);
    this.usersService.createUser(this.usersForm.getRawValue()).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => this.created.emit(), error: () => this.errorMessage.set('The user could not be created. Please try again.'),
    });
  }
}

export { UserFormComponent as FormComponent };
