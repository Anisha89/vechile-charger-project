import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JqxgaugeComponent } from './jqxgauge.component';

describe('JqxgaugeComponent', () => {
  let component: JqxgaugeComponent;
  let fixture: ComponentFixture<JqxgaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxgaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxgaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
