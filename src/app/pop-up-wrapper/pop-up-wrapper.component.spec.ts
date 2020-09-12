import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpWrapperComponent } from './pop-up-wrapper.component';

describe('PopUpWrapperComponent', () => {
  let component: PopUpWrapperComponent;
  let fixture: ComponentFixture<PopUpWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
