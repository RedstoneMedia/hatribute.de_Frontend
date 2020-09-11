import { BackendAdminDashboard } from './BackendAdminDashboard';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  backendAdminDashboard: BackendAdminDashboard;
  UserData: any;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit(): void {
    this.data.changeCurRoute("admin-dashboard");
    this.backendAdminDashboard = new BackendAdminDashboard(this.client, this);
    this.backendAdminDashboard.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
      this.data.changeRole(data.user.role);
      if (this.UserData.role < 3) {
        this.router.navigate(["homework-list"]);
      }
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

}
