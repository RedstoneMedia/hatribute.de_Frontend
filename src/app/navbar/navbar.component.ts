import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { BackendSession } from '../BackendSession';

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

  constructor(private data: DataService, private client: HttpClient, protected router: Router) { }

  ngOnInit() {
    this.data.curRoute.subscribe(currentRoute => this.currentRoute = currentRoute);
    this.data.currentlyLoggedIn.subscribe(currentlyLoggedIn => this.currentlyLoggedIn = currentlyLoggedIn);
    this.data.currentRole.subscribe(currentRole => this.currentRole = currentRole);
  }

}
