import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../dataService';
import { Router } from '@angular/router';
import { BackendKnowledge } from './BackendKnowledge';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss']
})
export class KnowledgeComponent implements OnInit {

  backendKnowledge: BackendKnowledge;
  UserData;
  KnowledgeSources;
  curSelectedKnowledgeSource: any;
  addKnowledgeSource = false;
  AddKnowledgeSourceForm = new FormGroup({
    Title : new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
    Description : new FormControl(null, [Validators.required, Validators.minLength(50)]),
    Subject : new FormControl(null, [Validators.required]),
    Data : new FormControl(null, [Validators.required])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("knowledge");
    this.backendKnowledge = new BackendKnowledge(this.client, this);
    this.backendKnowledge.get_knowledge_sources((data) => {
      this.KnowledgeSources = data.knowledge_sources;
      console.log(data.knowledge_sources);
    }, () => {});
  }

  showKnowledgeSourceDetails(index: number) {
    this.curSelectedKnowledgeSource = this.KnowledgeSources[index];
  }

  closeKnowledgeSourceDetails() {
    this.curSelectedKnowledgeSource = null;
  }

  showAddKnowledgeSource() {
    this.addKnowledgeSource = true;
  }

  closeAddKnowledgeSource() {
    this.addKnowledgeSource = false;
  }

  addNewKnowledgeSource() {
    console.log(this.AddKnowledgeSourceForm.controls);
  }

}
