import { Component, OnInit } from '@angular/core';
import { BackendModDashboard } from './BackendModDashboard';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mod-dashboard',
  templateUrl: './mod-dashboard.component.html',
  styleUrls: ['./mod-dashboard.component.scss']
})
export class ModDashboardComponent implements OnInit {

  backendModDashboard: BackendModDashboard;
  reports: any;
  UserData: any;
  curReportedHomeworkDisplay: any;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("mod-dashboard");
    this.backendModDashboard = new BackendModDashboard(this.client, this);
    this.backendModDashboard.get_reports(() => {
        this.backendModDashboard.post_with_session_no_data("get_data", (data: any) => {
          this.UserData = data.user;
          this.data.changeRole(data.user.role);
      }, (error) => {
        console.log(error);
        this.router.navigate(['login']);
      });
    }, () => {});
  }

  showReportedHomework(reportedHomework) {
    this.curReportedHomeworkDisplay = reportedHomework;
    this.curReportedHomeworkDisplay["base64_images"] = [];
    this.backendModDashboard.get_sub_homework_images(this.curReportedHomeworkDisplay.reportHomeworkId, this.curReportedHomeworkDisplay.reportSubHomeworkId, (data) => {
      this.curReportedHomeworkDisplay["base64_images"] = data.base64_images;
    }, (error) => {
      this.closeReportedHomework();
    });
  }

  closeReportedHomework() {
    this.curReportedHomeworkDisplay = null;
  }

  resetSubHomework() {
    this.backendModDashboard.reset_sub_homework(this.curReportedHomeworkDisplay.reportHomeworkId, this.curReportedHomeworkDisplay.reportSubHomeworkId, () => {
      this.backendModDashboard.get_reports(() => {
        this.closeReportedHomework();
      }, () => {});
    });
  }
}
