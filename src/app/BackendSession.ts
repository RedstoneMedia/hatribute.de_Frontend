import { BackendComunicator } from './BackendComunicator';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';

export class BackendSession extends BackendComunicator {

  constructor(client: HttpClient, host: any, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress, port);
  }

  post_with_session(DataObject, route: string, succsesFunction: any, errorFunction: any, logOutOnError = true) {
    this.host.data.pushAsyncTaskToBeSynchronouslyExecuted(() => {
      if (localStorage["session-id"] !== undefined) {
        DataObject.session = localStorage["session-id"];
      } else {
        DataObject.session = sessionStorage["session-id"];
      }
      this.post_data(JSON.stringify(DataObject), route, (data: any) => {
        const session = data.session;
        if (session.session) {
          sessionStorage["session-id"] = session.session;
          sessionStorage["session-expires"] = session.expires;
          if (localStorage["session-id"] !== undefined) {
            localStorage["session-id"] = session.session;
            localStorage["session-expires"] = session.expires;
          }
        }
        this.host.data.changeLoggedIn(true);
        succsesFunction(data);
        this.host.data.doneWithTask();
      }, error => {
        if (logOutOnError) {
          this.host.data.changeLoggedIn(false);
          sessionStorage.removeItem("session-id");
          sessionStorage.removeItem("session-expires");
          localStorage.clear();
        }
        errorFunction(error);
        this.host.data.doneWithTask();
      });
    });
  }

  post_with_session_no_data(route: string, succsesFunction: any, errorFunction: any, logOutOnError = true) {
    this.host.data.pushAsyncTaskToBeSynchronouslyExecuted(() => {
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
        if (session.session) {
          sessionStorage["session-id"] = session.session;
          sessionStorage["session-expires"] = session.expires;
          if (localStorage["session-id"] !== undefined) {
            localStorage["session-id"] = session.session;
            localStorage["session-expires"] = session.expires;
          }
        }
        this.host.data.changeLoggedIn(true);
        succsesFunction(data);
        this.host.data.doneWithTask();
      }, error => {
        if (logOutOnError) {
          this.host.data.changeLoggedIn(false);
          sessionStorage.removeItem("session-id");
          sessionStorage.removeItem("session-expires");
          localStorage.clear();
        }
        errorFunction(error);
        this.host.data.doneWithTask();
      });
    });
  }

  check_session() {
    this.host.data.pushAsyncTaskToBeSynchronouslyExecuted(() => {
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
        if (session.session) {
          sessionStorage["session-id"] = session.session;
          sessionStorage["session-expires"] = session.expires;
          if (localStorage["session-id"] !== undefined) {
            localStorage["session-id"] = session.session;
            localStorage["session-expires"] = session.expires;
          }
        }
        this.host.data.changeLoggedIn(true);
        this.host.data.doneWithTask();
      }, error => {
        this.host.data.changeLoggedIn(false);
        sessionStorage.removeItem("session-id");
        sessionStorage.removeItem("session-expires");
        localStorage.clear();
        this.host.data.doneWithTask();
      });
    });
  }
}
