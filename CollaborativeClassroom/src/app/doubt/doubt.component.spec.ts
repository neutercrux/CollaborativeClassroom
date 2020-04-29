import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubtComponent } from './doubt.component';
import { FormsModule } from '@angular/forms';

describe('DoubtComponent', () => {
  let component: DoubtComponent;
  let fixture: ComponentFixture<DoubtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
