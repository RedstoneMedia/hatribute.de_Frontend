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
  TimeTableUpdateForm = new FormGroup({
    Username : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.pattern(/^.+\..+$/)]),
    Password : new FormControl(null, [Validators.required, Validators.minLength(4)]),
  });
  TimeTableDownloading = false;
  TimeTableDownloadInfo = "";
  TimeTableDownloadError = false;
  TimeTableDownloadInfoUpdaterIntrerval;


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
      console.log("delete account");
      this.backendAboutMe.delete_account(() => {}, () => {});
    } else {
      this.realyDelete = false;
      this.verifyStringInput = "";
    }
  }

  showUpdateTimeTableModal() {
    this.UpdateTimeTableModal = true;
  }

  closeUpdateTimeTableModal() {
    this.UpdateTimeTableModal = false;
  }

  UpdateTimetable() {
    const Username = this.TimeTableUpdateForm.controls.Username;
    const Password = this.TimeTableUpdateForm.controls.Password;

    if (Username.valid && Password.valid) {
      this.backendAboutMe.get_time_table(Username.value, Password.value, () => {
        this.TimeTableDownloadError = false;
        this.TimeTableDownloading = true;
        this.TimeTableDownloadInfoUpdaterIntrerval = setInterval(() => {
          this.backendAboutMe.get_time_table_download_info((data) => {
            this.TimeTableDownloadInfo = data.download_info;
            if (this.TimeTableDownloadInfo === "DONE") {
              clearInterval(this.TimeTableDownloadInfoUpdaterIntrerval);
              this.closeUpdateTimeTableModal();
              this.TimeTableDownloading = false;
            } else if (this.TimeTableDownloadInfo.includes("Error : ")) {
              clearInterval(this.TimeTableDownloadInfoUpdaterIntrerval);
              this.TimeTableDownloadError = true;
              this.TimeTableDownloading = false;
            }
          }, (error) => {});
        }, 1000);
      }, (error) => {});
      this.TimeTableUpdateForm.reset();
    }
  }
}
