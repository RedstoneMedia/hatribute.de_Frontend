import { HttpClient } from '@angular/common/http';
import { ModDashboardComponent } from './mod-dashboard.component';
import { BackendHomework } from '../homeworklist/BackendHomework';
import { Constants } from '../constants';

export class BackendModDashboard extends BackendHomework {

  constructor(client: HttpClient, host: ModDashboardComponent, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }

  get_reports(succsesFunction, errorFunction) {
    this.post_with_session_no_data("get_reports", (data: any) => {
      succsesFunction();
      this.host.reports = data.reports;
    }, (error: any) => {
      errorFunction();
      this.host.router.navigate(['login']);
    });
  }

  reset_sub_homework(homeworkId: number, subHomeworkId: number, succsesFunction) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "reset_sub_homework", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  remove_false_report(subHomeworkId: number, succsesFunction) {
    const jsonData = {
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "remove_false_report", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  get_users_data(succsesFunction) {
    this.post_with_session_no_data("get_users_data", (data: any) => {
      this.host.users = data.users;
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  remove_points(userId, points, succsesFunction) {
    const jsonData = {
      "user_id" : userId,
      "points" : points
    };
    this.post_with_session(jsonData, "remove_points", (data: any) => {
      this.get_users_data(() => {
        succsesFunction();
      });
    }, (error: any) => {
      console.error(error);
      this.host.router.navigate(['login']);
    });
  }

}
