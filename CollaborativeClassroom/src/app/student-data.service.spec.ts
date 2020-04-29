import { TestBed } from '@angular/core/testing';

import { StudentDataService } from './student-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StudentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule], 
    providers: [StudentDataService]
  }));

  it('should be created', () => {
    const service: StudentDataService = TestBed.get(StudentDataService);
    expect(service).toBeTruthy();
  });
});
