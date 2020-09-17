import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectTableListDisplayComponent } from './object-table-list-display.component';

describe('ObjectTableListDisplayComponent', () => {
  let component: ObjectTableListDisplayComponent;
  let fixture: ComponentFixture<ObjectTableListDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectTableListDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectTableListDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
