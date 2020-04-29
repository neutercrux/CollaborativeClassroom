import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataComponent } from './student-data.component';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StudentDataComponent', () => {
  let component: StudentDataComponent;
  let fixture: ComponentFixture<StudentDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDataComponent ],
      imports: [MatTableModule,MatPaginatorModule,RouterTestingModule,HttpClientTestingModule,BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
