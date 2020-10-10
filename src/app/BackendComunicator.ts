import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Constants } from './constants';


export class BackendComunicator {

  protected backendAdress: string;
  protected backendPort: number;

  constructor(protected client: HttpClient, protected host: any, backendAdress = Constants.backendUrl, backendPort = 3182) {
    this.backendAdress = backendAdress;
    this.backendPort = backendPort;
  }

  private _succses(data: any, succsesFunction) {
    succsesFunction(data);
  }

  private _error(error: any, errorFunction) {
    errorFunction(error);
  }

  post_data(DataObject, route, succsesFunction, errorFunction) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.client.post(`${Constants.requestProtocol}://${this.backendAdress}:${this.backendPort}/${route}`, DataObject , httpOptions).subscribe(
      (data: any) => this._succses(data, succsesFunction),
      error => this._error(error, errorFunction)
    );
  }

  get_data(args, route, succsesFunction, errorFunction) {
    this.client.get(`${Constants.requestProtocol}://${this.backendAdress}:${this.backendPort}/${route}?${args}`).subscribe(
      (data: any) => this._succses(data, succsesFunction),
      error => this._error(error, errorFunction)
    );
  }

}
