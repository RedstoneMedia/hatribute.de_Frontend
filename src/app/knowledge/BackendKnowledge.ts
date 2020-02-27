import { HttpClient } from '@angular/common/http';
import { BackendSession } from '../BackendSession';
import { KnowledgeComponent } from './knowledge.component';

export class BackendKnowledge extends BackendSession {

  constructor(client: HttpClient, host: KnowledgeComponent, address = 'desktop-2d4qv4n.​kg0tg33tqt4rgjsp.​myfritz.​net', port = 3182) {
    super(client, host, address);
  }

  get_knowledge_sources(successFunction: any, errorFunction: any) {
    this.post_with_session_no_data("get_knowledge_sources", (data: any) => {
      successFunction(data);
    }, (error: any) => {
      console.error(error);
      errorFunction(error);
    });
  }

}
