import { ObjectTableListDisplayAddInputInfo, ObjectTableListDisplayAddPopupInfo, ObjectTableListDisplayOptions, ObjectTableListDisplayOptionsAction, ObjectTableListDisplayWhenKeyIsEqualToConditon } from './object-table-list-display/ObjectTableListDisplayOptions';
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
  schools: any;
  courseTableListDisplayOptions: ObjectTableListDisplayOptions;
  usersTableListDisplayOptions: ObjectTableListDisplayOptions;
  schoolTableListDisplayOptions: ObjectTableListDisplayOptions;

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
          this.courses = data.courses;
        });
      });
      this.backendAdminDashboard.getAllSchools((data: any) => {
        this.schools = data.schools;
      });
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

  initTables() {
    // Course table
    const addNewCoursePopupInfo = new ObjectTableListDisplayAddPopupInfo((data: any) => {
      this.backendAdminDashboard.addCourse(data.CourseName, data.school, data.DefaultCourse === "true", () => {});
    }, "Kurs Erstellen");
    addNewCoursePopupInfo.addInputToPopup("CourseName", new ObjectTableListDisplayAddInputInfo("Name", new FormControl(null, [Validators.required, Validators.pattern("^[\\w-_]{2,20}$")])));
    addNewCoursePopupInfo.addInputToPopup("DefaultCourse", new ObjectTableListDisplayAddInputInfo("Standart", new FormControl(null, [Validators.required, Validators.pattern("^(ja)|(nein)|(true)|(false)$")])));
    addNewCoursePopupInfo.addInputToPopup("school", new ObjectTableListDisplayAddInputInfo("Schulname", new FormControl(null, [Validators.required, Validators.pattern("^[\\w-_]{2,40}$")]), "test-school"));
    this.courseTableListDisplayOptions = new ObjectTableListDisplayOptions("Kurs-Liste", (currentCourse: any) => {
      this.backendAdminDashboard.writeCourseChanges(currentCourse, () => {
        this.backendAdminDashboard.getAllCourses((data: any) => {
          this.courses = data.courses;
        });
      });
    }, Constants.adminReadOnlyKeys, addNewCoursePopupInfo);
    this.courseTableListDisplayOptions.addColumn("CourseId", "Id");
    this.courseTableListDisplayOptions.addColumn("CourseName", "Name");
    this.courseTableListDisplayOptions.addColumn("IsDefaultCourse", "Standart");

    // Remove course action
    const removeCourseAction = new ObjectTableListDisplayOptionsAction("Krus Löschen", (currentCourse: any) => {
      this.backendAdminDashboard.removeCourse(currentCourse.CourseId, (data: any) => {
        this.backendAdminDashboard.getAllCourses((data: any) => {
          this.courses = data.courses;
        });
      });
    }, true);
    this.courseTableListDisplayOptions.addAction(removeCourseAction);


    // User table
    const addNewUserPopupInfo = new ObjectTableListDisplayAddPopupInfo((data: any) => {
      this.backendAdminDashboard.setupNewUser(data.name, data.school, (newUserData: any) => {
        this.backendAdminDashboard.get_users_data((data: any) => {
          for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if (user.id === newUserData.new_user_id) {
              user.newToken = newUserData.new_first_time_sign_in_token;
              break;
            }
          }
        });
      });
    }, "Account Erstellen");
    addNewUserPopupInfo.addInputToPopup("school", new ObjectTableListDisplayAddInputInfo("Schulname", new FormControl(null, [Validators.required, Validators.pattern("^[\\w-_]{2,40}$")]), "test-school"));
    addNewUserPopupInfo.addInputToPopup("name", new ObjectTableListDisplayAddInputInfo("Nutzername", new FormControl(null, [Validators.required, Validators.pattern("^[\\w\.-äüöß]{4,30}$")])));
    this.usersTableListDisplayOptions = new ObjectTableListDisplayOptions("Nutzer-Liste", (currentUser: any) => {
      delete currentUser.newToken;
      this.backendAdminDashboard.writeUserChanges(currentUser, () => {
        this.backendAdminDashboard.get_users_data(() => {});
      });
    }, Constants.adminReadOnlyKeys, addNewUserPopupInfo);
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


    // School table

    // Add school popup
    const addNewSchoolPopupInfo = new ObjectTableListDisplayAddPopupInfo((data: any) => {
      this.backendAdminDashboard.addSchool(data.school_name, () => {
        this.backendAdminDashboard.getAllSchools((data: any) => {
          this.schools = data.schools;
        });
      });
    }, "Schule Hinzufügen");
    addNewSchoolPopupInfo.addInputToPopup("school_name", new ObjectTableListDisplayAddInputInfo("Schulname", new FormControl(null, [Validators.required, Validators.pattern("^[\\w-_]{2,40}$")]), "test-school"));

    // School list
    this.schoolTableListDisplayOptions = new ObjectTableListDisplayOptions("Schul-Liste", (currentSchool: any) => {
      this.backendAdminDashboard.writeSchoolChanges(currentSchool, () => {
        this.backendAdminDashboard.getAllSchools((data: any) => {
          this.schools = data.schools;
        });
      });
    }, Constants.adminReadOnlyKeys, addNewSchoolPopupInfo);
    this.schoolTableListDisplayOptions.addColumn("name", "Schulname");
    this.schoolTableListDisplayOptions.addColumn("id", "Id");

    // Remove school action
    const removeSchoolAction = new ObjectTableListDisplayOptionsAction("Schule Löschen", (currentSchool: any) => {
      this.backendAdminDashboard.removeSchool(currentSchool.id, (data: any) => {
        this.backendAdminDashboard.getAllSchools((data: any) => {
          this.schools = data.schools;
        });
      });
    }, true);
    this.schoolTableListDisplayOptions.addAction(removeSchoolAction);

  }
}
