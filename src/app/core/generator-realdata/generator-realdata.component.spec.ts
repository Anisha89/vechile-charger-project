import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorRealdataComponent } from './generator-realdata.component';

describe('GeneratorRealdataComponent', () => {
  let component: GeneratorRealdataComponent;
  let fixture: ComponentFixture<GeneratorRealdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorRealdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorRealdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
