import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubtComponent } from './doubt.component';

describe('DoubtComponent', () => {
  let component: DoubtComponent;
  let fixture: ComponentFixture<DoubtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubtComponent ]
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
