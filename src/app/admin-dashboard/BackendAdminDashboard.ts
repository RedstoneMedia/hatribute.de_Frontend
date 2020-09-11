import { BackendModDashboard } from './../mod-dashboard/BackendModDashboard';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';

export class BackendAdminDashboard extends BackendModDashboard {

  constructor(client: HttpClient, host: any, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }
}
