import { HttpClient } from '@angular/common/http';
import { ModDashboardComponent } from './mod-dashboard.component';
import { BackendSchoolClass } from '../homeworklist/BackendSchoolClass';

export class BackendModDashboard extends BackendSchoolClass {

  constructor(client: HttpClient, host: ModDashboardComponent, adrress = '192.168.178.23', port = 31812) {
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

}
