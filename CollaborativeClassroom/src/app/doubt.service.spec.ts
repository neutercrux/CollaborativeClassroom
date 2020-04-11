import { TestBed } from '@angular/core/testing';

import { DoubtService } from './doubt.service';

describe('DoubtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoubtService = TestBed.get(DoubtService);
    expect(service).toBeTruthy();
  });
});
