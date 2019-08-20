import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsDescriptionComponent } from './charts-description.component';

describe('ChartsDescriptionComponent', () => {
  let component: ChartsDescriptionComponent;
  let fixture: ComponentFixture<ChartsDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
