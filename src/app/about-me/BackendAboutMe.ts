import { BackendSession } from './../BackendSession';
import { HttpClient } from '@angular/common/http';
import { AboutMeComponent } from './about-me.component';
import { Constants } from '../constants';


export class BackendAboutMe extends BackendSession {

  constructor(client: HttpClient, host, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }

  logout(successFunction: any, errorFunction: any): void {
    this.post_with_session_no_data("logout", (data: any) => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      localStorage.clear();
      this.host.router.navigate(['']);
      successFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
      errorFunction();
    });
  }

  getAllUserSchoolCourses(successFunction: (data: any) => void): void {
    this.post_with_session_no_data("get_all_user_school_courses", (data: any) => {
      successFunction(data);
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  getUserCoursesWithoutHomework(successFunction: (data: any) => void): void {
    const jsonData = {
      include_homework: false
    };
    this.post_with_session(jsonData, "get_user_courses", (data: any) => {
      successFunction(data);
    }, () => {});
  }

  addUserCourse(courseId: number, successFunction: (data: any) => void): void {
    const jsonData = {
      course_id: courseId
    };
    this.post_with_session(jsonData, "add_user_course", (data: any) => {
      successFunction(data);
    }, () => {});
  }

  removeUserCourse(courseId: number, successFunction: (data: any) => void): void {
    const jsonData = {
      course_id: courseId
    };
    this.post_with_session(jsonData, "remove_user_course", (data: any) => {
      successFunction(data);
    }, () => {});
  }

  delete_account(successFunction: any, errorFunction: any): void {
    this.post_with_session_no_data("delete_account", (data: any) => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      this.host.router.navigate(['']);
      successFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
      errorFunction();
    });
  }
}
