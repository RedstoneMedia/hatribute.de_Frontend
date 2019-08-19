import { BackendComunicator } from '../BackendComunicator';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import {Router} from "@angular/router";
import { SigninComponent } from './signin.component';

export class BackendSigin extends BackendComunicator {

  secure_random_number() {
    const array = new Uint32Array(2);
    return window.crypto.getRandomValues(array).toString();
  }

  constructor(client: HttpClient, host: SigninComponent, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress);
  }

  sign_in(password: string, email: string, name: string, school: string, schoolClass: string) {
      const salt = this.secure_random_number().replace(",", "");
      const hashedpwd = CryptoJS.SHA512(salt + password.trim()).toString();
      const jsondata = JSON.stringify({
        "hashedpwd" : hashedpwd,
        "email" : email,
        "name" : name,
        "school" : school,
        "school_class" : schoolClass,
        "salt" : salt,
      });
      // Sgin in with data
      this.post_data(jsondata, "sign-in", (data: any) => {
        const jsondata = JSON.stringify({
          "hashedpwd" : hashedpwd,
          "email" : email
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
