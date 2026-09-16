import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PendingApproval } from '../models/approvals';
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
export class WorkflowService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.adminApiUrl}/pending`;

  getPendingApprovals(): Observable<PendingApproval[]> {
    return this.http
      .get<ApiResponse<PendingApproval[]> | PendingApproval[]>(this.apiUrl)
      .pipe(map((res) => (Array.isArray(res) ? res : res.data)));
  }

  approveMember(enrollmentId: number): Observable<void> {
    return this.http
      .post<ApiResponse<void> | void>(`${environment.adminApiUrl}/enrollments/${enrollmentId}/approve`, {})
      .pipe(map(() => undefined));
  }
}
