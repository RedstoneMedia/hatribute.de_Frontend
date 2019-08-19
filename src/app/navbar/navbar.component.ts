import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentRoute: string;
  currentlyLoggedIn: boolean;

  constructor(private data: DataService, private client: HttpClient, protected router: Router) { }

  ngOnInit() {
    this.data.curRoute.subscribe(currentRoute => this.currentRoute = currentRoute);
    this.data.currentlyLoggedIn.subscribe(currentlyLoggedIn => this.currentlyLoggedIn = currentlyLoggedIn);
  }

}
