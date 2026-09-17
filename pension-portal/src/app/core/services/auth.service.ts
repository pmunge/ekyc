import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth_token';
const PENDING_PHONE_KEY = 'auth_pending_phone';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  message?: string;
}

export interface VerifyOtpResponseData {
  token: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.pensionEnrollmentsApiUrl}/admin-users`;

  private readonly pendingPhoneNumber = signal<string | null>(
    sessionStorage.getItem(PENDING_PHONE_KEY)
  );

  login(phoneNumber: string, password: string): Observable<LoginResponseData> {
    return this.http
      .post<ApiResponse<LoginResponseData>>(`${this.baseUrl}/login`, {
        phoneNumber,
        password,
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Incorrect phone number or password.');
          }

          this.pendingPhoneNumber.set(phoneNumber);
          sessionStorage.setItem(PENDING_PHONE_KEY, phoneNumber);
          return res.data;
        })
      );
  }

  verifyOtp(otp: string): Observable<VerifyOtpResponseData> {
    const phoneNumber = this.pendingPhoneNumber();

    if (!phoneNumber) {
      return throwError(() => new Error('No login is in progress. Please sign in again.'));
    }

    return this.http
      .post<ApiResponse<VerifyOtpResponseData>>(`${this.baseUrl}/login/verify-otp`, {
        phoneNumber,
        otp,
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Invalid or expired OTP.');
          }

          this.completeLogin(res.data);
          return res.data;
        })
      );
  }

  hasPendingLogin(): boolean {
    return this.pendingPhoneNumber() !== null;
  }

  getPendingPhoneNumber(): string | null {
    return this.pendingPhoneNumber();
  }

  private completeLogin(data: VerifyOtpResponseData): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.removeItem(PENDING_PHONE_KEY);
    this.pendingPhoneNumber.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(PENDING_PHONE_KEY);
    this.pendingPhoneNumber.set(null);
  }
}
