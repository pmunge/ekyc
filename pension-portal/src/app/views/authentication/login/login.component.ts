import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CountriesService } from '../../../core/services/countries.service';
import { Country } from '../../../core/models/country';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private countriesService = inject(CountriesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly countries = signal<Country[]>([]);
  readonly selectedCountryCode = signal('');

  readonly selectedCallingCode = computed(() => {
    const country = this.countries().find((c) => c.code === this.selectedCountryCode());
    if (!country?.callingCode) {
      return '';
    }
    return country.callingCode.startsWith('+') ? country.callingCode : `+${country.callingCode}`;
  });

  loginForm = this.fb.nonNullable.group({
    countryCode: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{7,12}$/)]],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loginForm.controls.countryCode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code) => this.selectedCountryCode.set(code));

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries);
        const defaultCountry = countries.find((c) => c.code === 'KE') || countries[0];
        if (defaultCountry) {
          this.loginForm.controls.countryCode.setValue(defaultCountry.code);
        }
      },
      error: () => {
        this.errorMessage.set('Unable to load country list. Please try again later.');
      }
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { phoneNumber, password } = this.loginForm.getRawValue();
    const localNumber = phoneNumber.replace(/^0+/, '');
    const fullPhoneNumber = `${this.selectedCallingCode()}${localNumber}`;

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login(fullPhoneNumber, password).subscribe({
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
