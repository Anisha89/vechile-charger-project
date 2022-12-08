import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorLocationComponent } from './generator-location.component';

describe('GeneratorLocationComponent', () => {
  let component: GeneratorLocationComponent;
  let fixture: ComponentFixture<GeneratorLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
