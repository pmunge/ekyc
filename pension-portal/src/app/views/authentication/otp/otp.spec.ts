import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Otp } from './otp';

describe('Otp', () => {
  let component: Otp;
  let fixture: ComponentFixture<Otp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otp],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Otp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
