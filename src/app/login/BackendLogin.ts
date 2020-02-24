import { BackendComunicator } from '../BackendComunicator';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';
import * as CryptoJS from 'crypto-js';
import {Router} from "@angular/router";

export class BackendLogin extends BackendComunicator {

  constructor(client: HttpClient, host: LoginComponent, adrress = 'desktop-2d4qv4n.​kg0tg33tqt4rgjsp.​myfritz.​net', port = 3182) {
    super(client, host, adrress);
  }

  login(password: string, email: string, stayLoggedIn: boolean) {
      const jsondata = JSON.stringify({
        "password" : password.trim(),
        "email" : email,
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
        this.host.errortext = "Falsches Passwort oder Email.";
        this.host.right = false;
        localStorage.clear();
      });
  }
}
