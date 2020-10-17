import { BackendComunicator } from '../BackendComunicator';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';
import {Router} from "@angular/router";
import { Constants } from '../constants';

export class BackendLogin extends BackendComunicator {

  constructor(client: HttpClient, host: LoginComponent, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }

  login(password: string, userName: string, stayLoggedIn: boolean) {
      const jsondata = JSON.stringify({
        "password" : password.trim(),
        "user_name" : userName,
        "stay_logged_in" : stayLoggedIn
      });
      // login with password
      this.post_data(jsondata, "login", (data: any) => {
        this.host.right = true;
        const session = data.session;
        sessionStorage["session-id"] = session.session;
        sessionStorage["session-expires"] = session.expires;
        if (stayLoggedIn) {
          localStorage["session-id"] = session.session;
          localStorage["session-expires"] = session.expires;
        } else {
          localStorage.clear();
        }
        this.host.data.changeLoggedIn(true);
        this.host.router.navigate(['about-me']);
      }, error => {
        this.host.errortext = "Falsches Passwort oder Falscher Nutzername.";
        this.host.right = false;
        localStorage.clear();
      });
  }
}
