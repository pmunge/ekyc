import { TestBed } from '@angular/core/testing';
import { PensionsService } from './pensions.service';

describe('PensionsService', () => {
  let service: PensionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PensionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
