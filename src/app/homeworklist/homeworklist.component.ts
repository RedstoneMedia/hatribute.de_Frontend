import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendSchoolClass } from './BackendSchoolClass';

@Component({
  selector: 'app-homeworklist',
  templateUrl: './homeworklist.component.html',
  styleUrls: ['./homeworklist.component.scss']
})
export class HomeworklistComponent implements OnInit {

  backendSchoolClass: BackendSchoolClass;
  schoolClass: any;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("homework-list");
    this.backendSchoolClass = new BackendSchoolClass(this.client, this);
    this.backendSchoolClass.get_school_class_data(() => {}, () => {});
  }

}
