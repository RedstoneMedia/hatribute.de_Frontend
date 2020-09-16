import { Constants } from './../constants';
import { PopupData } from './../pop-up-wrapper/pop-up-data';
import { BackendAdminDashboard } from './BackendAdminDashboard';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  backendAdminDashboard: BackendAdminDashboard;
  UserData: any;
  users: any;
  courses: any;
  currentUser: any;
  currentCourse: any;
  userEditPopUpData: PopupData;
  courseEditPopUpData: PopupData;
  adminReadOnlyKeys = Constants.adminReadOnlyKeys;

  AddUserForm = new FormGroup({
    name : new FormControl(null, [Validators.required, Validators.minLength(4)]),
    school : new FormControl(null, [Validators.required, Validators.minLength(5)])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit(): void {
    this.data.changeCurRoute("admin-dashboard");
    this.courseEditPopUpData = new PopupData("Kurs Popup");
    this.userEditPopUpData = new PopupData("Nutzer Popup");
    this.backendAdminDashboard = new BackendAdminDashboard(this.client, this);
    this.backendAdminDashboard.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
      this.data.changeRole(data.user.role);
      if (this.UserData.role < 3) {
        this.router.navigate(["homework-list"]);
      }
      this.backendAdminDashboard.get_users_data(() => {
        this.backendAdminDashboard.getAllCourses((data: any) => {
          console.log(data);
          this.courses = data.courses;
        });
      });
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

  openUserEditPopUp(user: any): void {
    this.currentUser = user;
    this.userEditPopUpData.open();
  }

  changeEditPopUpInputValue(key, event): void {
    try {
      this.currentUser[key] = JSON.parse(event.srcElement.value);
    } catch (SyntaxError) {
      if (typeof this.currentUser[key] === "string") {
        this.currentUser[key] = event.srcElement.value;
      } else {
        event.srcElement.value = this.currentUser[key];
      }
    }
  }

  writeUserChanges(): void {
    delete this.currentUser.newToken;
    this.backendAdminDashboard.writeUserChanges(this.currentUser, () => {
      this.backendAdminDashboard.get_users_data(() => {
        this.currentUser = null;
        this.userEditPopUpData.close();
      });
    });
  }

  generateNewTokenForDeactivatedUser(): void {
    this.backendAdminDashboard.generateNewTokenForDeactivatedUser(this.currentUser.id, (newToken: string) => {
      this.currentUser.newToken = newToken;
    });
  }

  addNewUser(): void {
    const userName = this.AddUserForm.controls.name;
    const schoolName = this.AddUserForm.controls.school;

    if (userName.valid && schoolName.valid) {
      this.backendAdminDashboard.setupNewUser(userName.value, schoolName.value, (newUserData: any) => {
        this.backendAdminDashboard.get_users_data(() => {
          for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if (user.id === newUserData.new_user_id) {
              user.newToken = newUserData.new_first_time_sign_in_token;
              this.openUserEditPopUp(user);
              break;
            }
          }
        });
      });
    }
  }

  removeDeactivatedUser(): void {
    this.backendAdminDashboard.removeDeactivatedUser(this.currentUser.id, (newUserData: any) => {
      this.backendAdminDashboard.get_users_data(() => {
        this.userEditPopUpData.close();
      });
    });
  }

  openCourseEditPopUp(course: any): void {
    this.currentCourse = course;
    this.courseEditPopUpData.open();
  }

  closeCourseEditPopUp(): void {
    this.courseEditPopUpData.close();
    this.currentCourse = null;
  }

  changeCoursePopUpInputValue(key, event): void {
    try {
      this.currentCourse[key] = JSON.parse(event.srcElement.value);
    } catch (SyntaxError) {
      if (typeof this.currentCourse[key] === "string") {
        this.currentCourse[key] = event.srcElement.value;
      } else {
        event.srcElement.value = this.currentCourse[key];
      }
    }
  }

  writeCourseChanges() {
    this.backendAdminDashboard.writeCourseChanges(this.currentCourse, () => {
      this.backendAdminDashboard.getAllCourses(() => {
        this.closeCourseEditPopUp();
      });
    });
  }
}
