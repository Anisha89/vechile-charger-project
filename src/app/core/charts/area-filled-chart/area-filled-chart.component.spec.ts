import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaFilledChartComponent } from './area-filled-chart.component';

describe('AreaFilledChartComponent', () => {
  let component: AreaFilledChartComponent;
  let fixture: ComponentFixture<AreaFilledChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaFilledChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaFilledChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
