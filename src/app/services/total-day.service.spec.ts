import { TestBed } from '@angular/core/testing';

import { TotalDayService } from './total-day.service';

describe('TotalDayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TotalDayService = TestBed.get(TotalDayService);
    expect(service).toBeTruthy();
  });
});
