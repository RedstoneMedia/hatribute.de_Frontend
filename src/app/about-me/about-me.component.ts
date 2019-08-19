import { Component, OnInit } from '@angular/core';
import { BackendSession } from '../BackendSession';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  backendSession: BackendSession;
  UserData;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("about-me");
    this.backendSession = new BackendSession(this.client, this);
    this.backendSession.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

}
