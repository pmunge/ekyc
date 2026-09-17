import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Staff } from '../models/staff';
import { CreateUserPayload } from '../models/staff';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/staff`;
  private readonly adminUsersUrl = `${environment.pensionEnrollmentsApiUrl}/admin-users`;

  getStaff(): Observable<Staff[]> {
    return this.http
      .get<ApiResponse<Staff[]> | Staff[]>(this.adminUsersUrl)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }

  /** Change this URL here when the dedicated create-user endpoint is available. */
  createUser(payload: CreateUserPayload): Observable<Staff> {
    return this.http
      .post<ApiResponse<Staff>>(this.apiUrl, payload)
      .pipe(map((res) => res.data));
  }

}
