import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pensioner } from '../models/pensioners';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PensionsService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.adminApiUrl}/enrollments`;

  getPensioners(): Observable<Pensioner[]> {
    return this.http
      .get<ApiResponse<Pensioner[]> | Pensioner[]>(this.apiUrl)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
}
