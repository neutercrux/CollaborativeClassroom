import { TestBed } from '@angular/core/testing';

import { StudentDataService } from './student-data.service';

describe('StudentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentDataService = TestBed.get(StudentDataService);
    expect(service).toBeTruthy();
  });
});
