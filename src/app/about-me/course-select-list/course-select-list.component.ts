import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupData } from './../../pop-up-wrapper/pop-up-data';
import { BackendAboutMe } from './../BackendAboutMe';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-select-list',
  templateUrl: './course-select-list.component.html',
  styleUrls: ['./course-select-list.component.scss']
})
export class CourseSelectListComponent implements OnInit {
  @Input() backendAboutMe: BackendAboutMe;
  courses: any;
  allUserSchoolCourses: any;
  addCourseToMyListPopUpData: PopupData;
  addCourseToMyListForm = new FormGroup({
    course: new FormControl(null, [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
    this.addCourseToMyListPopUpData = new PopupData("Kurs hinzufügen");
    this.backendAboutMe.getUserCoursesWithoutHomework((data: any) => {
      this.courses = [];
      for (let i = 0; i < data.courses.length; i++) {
        const course = data.courses[i];
        if (course.IsDefaultCourse === false) {
          this.courses.push(course);
        }
      }
    });
    this.backendAboutMe.getAllUserSchoolCourses((data: any) => {
      this.allUserSchoolCourses = [];
      for (let i = 0; i < data.courses.length; i++) {
        const course = data.courses[i];
        if (course.IsDefaultCourse === false) {
          this.allUserSchoolCourses.push(course);
        }
      }
    });
  }

  removeCourseFormMyList(course: any): void {
    this.backendAboutMe.removeUserCourse(course.CourseId, (data: any) => {
      this.backendAboutMe.getUserCoursesWithoutHomework((data: any) => {
        this.courses = [];
        for (let i = 0; i < data.courses.length; i++) {
          const course = data.courses[i];
          if (course.IsDefaultCourse === false) {
            this.courses.push(course);
          }
        }
      });
    });
  }

  addCourseToMyListOpenPopup(): void {
    this.addCourseToMyListPopUpData.open();
  }

  addCourseToMyList(): void {
    if (this.addCourseToMyListForm.valid) {
      this.backendAboutMe.addUserCourse(this.addCourseToMyListForm.controls.course.value, (data: any) => {
        this.backendAboutMe.getUserCoursesWithoutHomework((data: any) => {
          this.courses = [];
          for (let i = 0; i < data.courses.length; i++) {
            const course = data.courses[i];
            if (course.IsDefaultCourse === false) {
              this.courses.push(course);
            }
          }
          this.addCourseToMyListPopUpData.close();
        });
      });
    }
  }

}
