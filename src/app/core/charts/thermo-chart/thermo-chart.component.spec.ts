import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermoChartComponent } from './thermo-chart.component';

describe('ThermoChartComponent', () => {
  let component: ThermoChartComponent;
  let fixture: ComponentFixture<ThermoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
