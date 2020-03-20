import { TestBed } from '@angular/core/testing';

import { CurrentLineService } from './current-line.service';

describe('CurrentLineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentLineService = TestBed.get(CurrentLineService);
    expect(service).toBeTruthy();
  });
});
