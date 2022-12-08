import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorDescComponent } from './generator-desc.component';

describe('GeneratorDescComponent', () => {
  let component: GeneratorDescComponent;
  let fixture: ComponentFixture<GeneratorDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
