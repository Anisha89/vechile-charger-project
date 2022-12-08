import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorAlarmPointComponent } from './generator-alarm-point.component';

describe('GeneratorAlarmPointComponent', () => {
  let component: GeneratorAlarmPointComponent;
  let fixture: ComponentFixture<GeneratorAlarmPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorAlarmPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorAlarmPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
