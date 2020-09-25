import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSelectListComponent } from './course-select-list.component';

describe('CourseSelectListComponent', () => {
  let component: CourseSelectListComponent;
  let fixture: ComponentFixture<CourseSelectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSelectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
