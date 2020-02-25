import { TestBed } from '@angular/core/testing';

import { CurrentFileService } from './current-file.service';

describe('CurrentFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentFileService = TestBed.get(CurrentFileService);
    expect(service).toBeTruthy();
  });
});
