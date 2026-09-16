import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Advance } from '../models/transactions';
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
export class TransactionsService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.adminApiUrl}/advances`;

  getTransactions(): Observable<Advance[]> {
    return this.http
      .get<ApiResponse<Advance[]> | Advance[]>(this.apiUrl)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }
}
