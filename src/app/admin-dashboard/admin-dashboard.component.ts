import { ObjectTableListDisplayOptions, ObjectTableListDisplayOptionsAction, ObjectTableListDisplayWhenKeyIsEqualToConditon } from './object-table-list-display/ObjectTableListDisplayOptions';
import { Constants } from './../constants';
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
  courseTableListDisplayOptions: ObjectTableListDisplayOptions;
  usersTableListDisplayOptions: ObjectTableListDisplayOptions;

  AddUserForm = new FormGroup({
    name : new FormControl(null, [Validators.required, Validators.minLength(4)]),
    school : new FormControl(null, [Validators.required, Validators.minLength(5)])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit(): void {
    this.data.changeCurRoute("admin-dashboard");
    this.initTables();
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

  initTables() {
    // Course table
    this.courseTableListDisplayOptions = new ObjectTableListDisplayOptions("Kurs-Liste", (currentCourse: any) => {
      this.backendAdminDashboard.writeCourseChanges(currentCourse, () => {
        this.backendAdminDashboard.getAllCourses(() => {});
      });
    }, Constants.adminReadOnlyKeys);
    this.courseTableListDisplayOptions.addColumn("CourseId", "Id");
    this.courseTableListDisplayOptions.addColumn("CourseName", "Name");
    this.courseTableListDisplayOptions.addColumn("IsDefaultCourse", "Standart");


    // User table
    this.usersTableListDisplayOptions = new ObjectTableListDisplayOptions("Nutzer-Liste", (currentUser: any) => {
      delete currentUser.newToken;
      this.backendAdminDashboard.writeUserChanges(currentUser, () => {
        this.backendAdminDashboard.get_users_data(() => {});
      });
    }, Constants.adminReadOnlyKeys);
    this.usersTableListDisplayOptions.addColumn("name", "Nutzer");
    this.usersTableListDisplayOptions.addColumn("role", "Role");
    this.usersTableListDisplayOptions.addColumn("points", "Punkte");
    this.usersTableListDisplayOptions.addColumn("id", "Id");
    this.usersTableListDisplayOptions.addColumn("school_id", "Schul Id");

    // Gen new token action
    const genNewTokenAction = new ObjectTableListDisplayOptionsAction("Token generieren", (currentUser: any) => {
      this.backendAdminDashboard.generateNewTokenForDeactivatedUser(currentUser.id, (newToken: string) => {
        currentUser.newToken = newToken;
      });
    });
    genNewTokenAction.addCondition(new ObjectTableListDisplayWhenKeyIsEqualToConditon("is_active", false));
    this.usersTableListDisplayOptions.addAction(genNewTokenAction);

    // Remove deactivated user action
    const removeDeactivatedUserAction = new ObjectTableListDisplayOptionsAction("Account löschen", (currentUser: any) => {
      this.backendAdminDashboard.removeDeactivatedUser(currentUser.id, (newUserData: any) => {
        this.backendAdminDashboard.get_users_data(() => {});
      });
    }, true);
    removeDeactivatedUserAction.addCondition(new ObjectTableListDisplayWhenKeyIsEqualToConditon("is_active", false));
    this.usersTableListDisplayOptions.addAction(removeDeactivatedUserAction);

    // Make user row gray if not active
    this.usersTableListDisplayOptions.addStyleCondition(new ObjectTableListDisplayWhenKeyIsEqualToConditon("is_active", false), {color : "#b8b8b8"});

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
              break;
            }
          }
        });
      });
    }
  }
}
