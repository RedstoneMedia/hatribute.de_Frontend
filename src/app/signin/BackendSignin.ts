import { BackendComunicator } from '../BackendComunicator';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import {Router} from "@angular/router";
import { SigninComponent } from './signin.component';
import { Constants } from '../constants';

export class BackendSigin extends BackendComunicator {

  constructor(client: HttpClient, host: SigninComponent, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }

  sign_in(password: string, email: string, name: string, school: string, firstTimeSignInToken: string) {
      password = password.trim().toString();
      const jsondata = JSON.stringify({
        "password" : password,
        "email" : email,
        "name" : name,
        "school" : school,
        "first_time_sign_in_token" : firstTimeSignInToken
      });
      // Sign in with data
      this.post_data(jsondata, "sign-in", (data: any) => {
        const jsondata = JSON.stringify({
          "password" : password,
          "email" : email,
          "stay_logged_in" : false
        });
        // Login with salted password
        this.post_data(jsondata, "login", (data: any) => {
          this.host.right = true;
          const session = data.session;
          sessionStorage["session-id"] = session.session;
          sessionStorage["session-expires"] = session.expires;
          this.host.data.changeLoggedIn(true);
          this.host.router.navigate(['about-me']);
          // this.host.router.navigate(['password-manager']);
        }, error => {
          this.host.errortext = "Fehler beim einloggen in den Account.";
          this.host.right = false;
        });
      }, error => {
        console.log(error);
        this.host.errortext = "Fehler beim Kreieren des Account.";
        this.host.right = false;
      });
  }



}
