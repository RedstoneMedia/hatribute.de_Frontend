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
    userName : new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
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
    const userName = this.loginForm.controls.userName;
    const stayLoggedIn = this.loginForm.controls.stayLoggedIn;

    if (pwd.valid && userName.valid) {
      this.backendLogin.login(pwd.value, userName.value, stayLoggedIn.value);
      this.loginForm.reset();
    }
  }

}
