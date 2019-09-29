import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendAboutMe } from './BackendAboutMe';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  backendAboutMe: BackendAboutMe;
  UserData;
  realyDelete = false;
  verifyStringInput = "";
  UpdateTimeTableModal = false;


  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("about-me");
    this.backendAboutMe = new BackendAboutMe(this.client, this);
    this.backendAboutMe.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
      this.data.changeRole(data.user.role);
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

  logout() {
    this.backendAboutMe.logout(() => {}, () => {});
  }

  delete_account() {
    if (!this.realyDelete) {
      this.realyDelete = true;
    } else if ("Account Löschen" === this.verifyStringInput) {
      // delete account
      this.backendAboutMe.delete_account(() => {}, () => {});
    } else {
      this.realyDelete = false;
      this.verifyStringInput = "";
    }
  }
}
