import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'
import { environment } from '../../../environments/environment';
import { Permissions } from '../models/permissions';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private http = inject(HttpClient)
  private readonly apiUrl = `${environment.apiUrl}/permissions`

  getPermissions(): Observable<Permissions[]> {
    return this.http
      .get<ApiResponse<Permissions[]>>(this.apiUrl)
      .pipe(map((res) => res.data))
  }
  
}
