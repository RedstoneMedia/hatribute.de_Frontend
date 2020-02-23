import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { BackendSession } from '../BackendSession';
import { BackendAboutMe } from '../about-me/BackendAboutMe';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentRoute: string;
  currentlyLoggedIn: boolean;
  currentRole: number;
  BSession: any;
  backendAboutMe: BackendAboutMe;

  constructor(private data: DataService, private client: HttpClient, protected router: Router) { }

  onBeforeUnload(e) {
    // only logut if logged in and stay logged in is not active
    if (this.currentlyLoggedIn && (localStorage["session-id"] == null)) {
      this.backendAboutMe.logout(() => {
        console.log("Logged Out Successfully");
      }, (error) => {
        console.error("Could not log out");
      });
    }
    delete e['returnValue'];
  }

  ngOnInit() {
    this.data.curRoute.subscribe(currentRoute => this.currentRoute = currentRoute);
    this.data.currentlyLoggedIn.subscribe(currentlyLoggedIn => this.currentlyLoggedIn = currentlyLoggedIn);
    this.data.currentRole.subscribe(currentRole => this.currentRole = currentRole);
    this.backendAboutMe = new BackendAboutMe(this.client, this);

    window.addEventListener('beforeunload', (e) => {
      // only logut if logged in and stay logged in is not active
      if (this.currentlyLoggedIn && (localStorage["session-id"] == null) ) {
        this.backendAboutMe.logout(() => {
          console.log("Logged Out Successfully");
        }, (error) => {
          console.error("Could not log out");
        });
      }
      delete e['returnValue'];
    }, false);

    window.onbeforeunload = this.onBeforeUnload;

  }

}
