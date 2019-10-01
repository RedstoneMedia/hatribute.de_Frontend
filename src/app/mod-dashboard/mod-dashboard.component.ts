import { Component, OnInit } from '@angular/core';
import { BackendModDashboard } from './BackendModDashboard';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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

  PointRemoveForm = new FormGroup({
    Points : new FormControl(null, [Validators.required, Validators.pattern(/^-{0,1}\d+$/)])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
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
    this.curReportedHomeworkDisplay["imageUrls"] = [];
    this.backendModDashboard.get_sub_homework_images_url(this.curReportedHomeworkDisplay.id, this.curReportedHomeworkDisplay.id, (data) => {
      for (let j = 0; j < data.images_total; j++) {
        this.curReportedHomeworkDisplay.imageUrls.push(`\\${data.images_url}\\${j}.png`);
      }
    }, (error) => {
      this.closeReportedHomework();
    });
  }

  closeReportedHomework() {
    this.curReportedHomeworkDisplay = null;
  }

  showUser(user) {
    this.curUser = user;
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
}
