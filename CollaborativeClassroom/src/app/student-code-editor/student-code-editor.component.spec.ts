import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCodeEditorComponent } from './student-code-editor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatBadge } from '@angular/material';

describe('StudentCodeEditorComponent', () => {
  let component: StudentCodeEditorComponent;
  let fixture: ComponentFixture<StudentCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCodeEditorComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [MatBadge]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
