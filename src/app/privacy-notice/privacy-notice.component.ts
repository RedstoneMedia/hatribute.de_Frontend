import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendSession } from '../BackendSession';
import { BackendComunicator } from '../BackendComunicator';

@Component({
  selector: 'app-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss']
})
export class PrivacyNoticeComponent implements OnInit {
  displayContent = false;
  backendCommunicator: BackendComunicator;
  ownerInfo: any;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit(): void {
    this.data.changeCurRoute("privacy-notice");
    this.backendCommunicator = new BackendComunicator(this.client, this);
    this.backendCommunicator.post_data({"this_should_prevent_this_route_being_found_by_some_tools_also_if_you_read_this_dont_go_to_my_house_please_btw_i_hate_this_german_nosense_system": true}, "get_owner_info", (data: any) => {
      this.displayContent = true;
      this.ownerInfo = data;
    }, (error) => {
      this.displayContent = false;
    });
  }

}
