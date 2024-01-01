import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Brands2Component } from './brands2.component';

describe('Brands2Component', () => {
  let component: Brands2Component;
  let fixture: ComponentFixture<Brands2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Brands2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Brands2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
