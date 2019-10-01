import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendLogin } from './BackendLogin';
import { BackendSession } from '../BackendSession';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.pattern(
      // tslint:disable-next-line:max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    password: new FormControl(null, [Validators.minLength(7), Validators.required]),
    stayLoggedIn : new FormControl(null, [])
  });

  right = null;
  errortext = '';
  private backendLogin: BackendLogin;
  backendSession: BackendSession;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute('login');
    this.backendLogin = new BackendLogin(this.client, this);
    this.backendSession = new BackendSession(this.client, this);
    this.backendSession.check_session();
  }

  login() {
    const pwd = this.loginForm.controls.password;
    const email = this.loginForm.controls.email;
    const stayLoggedIn = this.loginForm.controls.stayLoggedIn;

    if (pwd.valid && email.valid) {
      this.backendLogin.login(pwd.value, email.value, stayLoggedIn.value);
      this.loginForm.reset();
    }
  }

}
