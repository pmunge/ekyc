import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Country } from '../models/country';
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
export class CountriesService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.countriesApiUrl;
  private countries$?: Observable<Country[]>;

  getCountries(): Observable<Country[]> {
    if (!this.countries$) {
      this.countries$ = this.http
        .get<ApiResponse<Country[]> | Country[]>(this.apiUrl)
        .pipe(
          map((res) => (Array.isArray(res) ? res : res.data)),
          shareReplay(1)
        );
    }

    return this.countries$;
  }
}
