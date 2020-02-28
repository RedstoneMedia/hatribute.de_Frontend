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
  KnowledgeSources;
  curSelectedKnowledgeSource: any;

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

}
