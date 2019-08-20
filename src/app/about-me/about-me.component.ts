import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendAboutMe } from './BackendAboutMe';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  backendAboutMe: BackendAboutMe;
  UserData;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("about-me");
    this.backendAboutMe = new BackendAboutMe(this.client, this);
    this.backendAboutMe.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

  logout() {
    console.log("logout !");
    this.backendAboutMe.logout(() => {}, () => {});
  }

}
