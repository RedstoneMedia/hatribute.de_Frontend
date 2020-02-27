import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { BackendKnowledge } from './BackendKnowledge';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss']
})
export class KnowledgeComponent implements OnInit {

  backendKnowledge: BackendKnowledge;
  UserData;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("knowledge");
    this.backendKnowledge = new BackendKnowledge(this.client, this);
    this.backendKnowledge.post_with_session_no_data("get_data", (data: any) => {
      this.UserData = data.user;
      this.data.changeRole(data.user.role);
    }, (error) => {
      console.log(error);
      this.router.navigate(['login']);
    });
  }

}
