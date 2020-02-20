import { HttpClient } from '@angular/common/http';
import { ModDashboardComponent } from './mod-dashboard.component';
import { BackendSchoolClass } from '../homeworklist/BackendSchoolClass';

export class BackendModDashboard extends BackendSchoolClass {

  constructor(client: HttpClient, host: ModDashboardComponent, adrress = 'desktop-2d4qv4n.​kg0tg33tqt4rgjsp.​myfritz.​net', port = 3182) {
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

  get_users_data(succsesFunction) {
    this.post_with_session_no_data("get_users_data", (data: any) => {
      succsesFunction();
      this.host.users = data.users;
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
