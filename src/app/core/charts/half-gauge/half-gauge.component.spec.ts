import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfGaugeComponent } from './half-gauge.component';

describe('HalfGaugeComponent', () => {
  let component: HalfGaugeComponent;
  let fixture: ComponentFixture<HalfGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalfGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
