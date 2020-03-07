import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCodeEditorComponent } from './student-code-editor.component';

describe('StudentCodeEditorComponent', () => {
  let component: StudentCodeEditorComponent;
  let fixture: ComponentFixture<StudentCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
