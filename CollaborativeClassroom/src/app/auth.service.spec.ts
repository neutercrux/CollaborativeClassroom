import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule], 
    providers: [AuthService]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
  it('should have getUSerDetails function', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service.getUserDetails).toBeTruthy();
   });
   it('should have addUserDetails function',() => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service.addUserDetails).toBeTruthy();
   })
});
