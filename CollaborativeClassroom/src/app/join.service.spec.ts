import { TestBed } from '@angular/core/testing';

import { JoinService } from './join.service';

describe('JoinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoinService = TestBed.get(JoinService);
    expect(service).toBeTruthy();
  });
});
