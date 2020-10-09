import { BackendComunicator } from './../BackendComunicator';
import { BackendSession } from './../BackendSession';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss']
})
export class SiteDetailsComponent implements OnInit {
  displayContent = false;
  backendCommunicator: BackendComunicator;
  ownerInfo: any;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit(): void {
    this.data.changeCurRoute("site-details");
    this.backendCommunicator = new BackendComunicator(this.client, this);
    this.backendCommunicator.post_data({"this_should_prevent_this_route_being_found_by_some_tools_also_if_you_read_this_dont_go_to_my_house_please_btw_i_hate_this_german_nosense_system": true}, "get_owner_info", (data: any) => {
      this.displayContent = true;
      this.ownerInfo = data;
    }, (error) => {
      this.displayContent = false;
    });
  }

}
