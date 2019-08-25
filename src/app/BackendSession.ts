import { BackendComunicator } from './BackendComunicator';
import { HttpClient } from '@angular/common/http';
import { copyStyles } from '@angular/animations/browser/src/util';

export class BackendSession extends BackendComunicator {

  constructor(client: HttpClient, host: any, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress, port);
  }

  post_with_session(DataObject, route: string, succsesFunction: any, errorFunction: any) {
    DataObject.session = sessionStorage["session-id"];
    this.post_data(JSON.stringify(DataObject), route, (data: any) => {
      const session = data.session;
      sessionStorage["session-id"] = session.session;
      sessionStorage["session-expires"] = session.expires;
      this.host.data.changeLoggedIn(true);
      succsesFunction(data);
    }, error => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      errorFunction(error);
    });
  }

  post_with_session_no_data(route: string, succsesFunction: any, errorFunction: any) {
    const jsondata = {
        "session" : sessionStorage["session-id"]
    };

    this.post_data(JSON.stringify(jsondata), route, (data: any) => {
      const session = data.session;
      sessionStorage["session-id"] = session.session;
      sessionStorage["session-expires"] = session.expires;
      this.host.data.changeLoggedIn(true);
      succsesFunction(data);
    }, error => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      errorFunction(error);
    });
  }

  check_session() {
    const jsondata = JSON.stringify({
      "session" : sessionStorage.getItem("session-id")
    });
    this.post_data(jsondata, "check_session", (data: any) => {
      const session = data.session;
      sessionStorage["session-id"] = session.session;
      sessionStorage["session-expires"] = session.expires;
      this.host.data.changeLoggedIn(true);
    }, error => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
    });
  }
}
