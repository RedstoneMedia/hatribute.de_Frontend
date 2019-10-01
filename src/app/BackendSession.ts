import { BackendComunicator } from './BackendComunicator';
import { HttpClient } from '@angular/common/http';

export class BackendSession extends BackendComunicator {

  constructor(client: HttpClient, host: any, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress, port);
  }

  post_with_session(DataObject, route: string, succsesFunction: any, errorFunction: any) {
    if (localStorage["session-id"] !== undefined) {
      DataObject.session = localStorage["session-id"];
    } else {
      DataObject.session = sessionStorage["session-id"];
    }

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
      localStorage.clear();
      errorFunction(error);
    });
  }

  post_with_session_no_data(route: string, succsesFunction: any, errorFunction: any) {
    let sessionId;
    if (localStorage["session-id"] !== undefined) {
      sessionId = localStorage["session-id"];
    } else {
      sessionId = sessionStorage["session-id"];
    }
    const jsondata = {
        "session" : sessionId
    };

    this.post_data(JSON.stringify(jsondata), route, (data: any) => {
      const session = data.session;
      sessionStorage["session-id"] = session.session;
      sessionStorage["session-expires"] = session.expires;
      if (localStorage["session-id"] !== undefined) {
        localStorage["session-id"] = session.session;
        localStorage["session-expires"] = session.expires;
      }
      this.host.data.changeLoggedIn(true);
      succsesFunction(data);
    }, error => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      localStorage.clear();
      errorFunction(error);
    });
  }

  check_session() {
    let sessionId;
    if (localStorage["session-id"] !== undefined) {
      sessionId = localStorage["session-id"];
    } else {
      sessionId = sessionStorage["session-id"];
    }

    const jsondata = JSON.stringify({
      "session" : sessionId
    });
    this.post_data(jsondata, "check_session", (data: any) => {
      const session = data.session;
      this.host.data.changeLoggedIn(true);
      if (localStorage["session-id"] !== undefined) {
        localStorage["session-id"] = session.session;
        localStorage["session-expires"] = session.expires;
      }
    }, error => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      localStorage.clear();
    });
  }
}
