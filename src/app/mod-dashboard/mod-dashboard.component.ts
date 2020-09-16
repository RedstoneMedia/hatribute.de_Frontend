import { Component, OnInit } from '@angular/core';
import { BackendModDashboard } from './BackendModDashboard';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PopupData } from '../pop-up-wrapper/pop-up-data';

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
  users: any;
  curUser: any;
  userRemovePointsPopUpData: PopupData;
  userViewReportPopUpData: PopupData;

  PointRemoveForm = new FormGroup({
    Points : new FormControl(null, [Validators.required, Validators.pattern(/^-{0,1}\d+$/)])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.userViewReportPopUpData = new PopupData("Report Sub Image anzeige");
    this.userRemovePointsPopUpData = new PopupData("Punkte Abziehen");
    this.data.changeCurRoute("mod-dashboard");
    this.backendModDashboard = new BackendModDashboard(this.client, this);
    this.backendModDashboard.get_reports(() => {
        this.backendModDashboard.get_users_data(() => {
          this.backendModDashboard.post_with_session_no_data("get_data", (data: any) => {
            this.UserData = data.user;
            this.data.changeRole(data.user.role);
          }, (error) => {
            console.log(error);
            this.router.navigate(['login']);
          });
        });
    }, () => {});
  }

  showReportedHomework(reportedHomework) {
    this.curReportedHomeworkDisplay = reportedHomework;
    this.curReportedHomeworkDisplay.id = this.curReportedHomeworkDisplay.reportSubHomeworkId;
    this.userViewReportPopUpData.open();
  }

  imageViewError(error: boolean) {
    if (error) {
      this.userViewReportPopUpData.close();
      this.curReportedHomeworkDisplay = null;
    }
  }

  closeReportedHomework() {
    this.curReportedHomeworkDisplay = null;
    this.userViewReportPopUpData.close();
  }

  showUser(user) {
    this.curUser = user;
    this.userRemovePointsPopUpData.open();
  }

  closeUser() {
    this.curUser = null;
  }

  removePoints() {
    if (this.PointRemoveForm.controls.Points.valid) {
      this.backendModDashboard.remove_points(this.curUser.id, this.PointRemoveForm.controls.Points.value, () => {
        this.PointRemoveForm.reset();
        this.closeUser();
      });
    }
  }

  resetSubHomework() {
    this.backendModDashboard.reset_sub_homework(this.curReportedHomeworkDisplay.reportHomeworkId, this.curReportedHomeworkDisplay.reportSubHomeworkId, () => {
      this.backendModDashboard.get_reports(() => {
        this.closeReportedHomework();
      }, () => {});
    });
  }

  removeFalseReport() {
    this.backendModDashboard.remove_false_report(this.curReportedHomeworkDisplay.reportSubHomeworkId, () => {
      this.backendModDashboard.get_reports(() => {
        this.closeReportedHomework();
      }, () => {});
    });
  }

  // TODO : Add option to remove a false report
}
