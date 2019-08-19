import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendSigin } from './BackendSignin';
import { BackendSession } from '../BackendSession';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.pattern(
      // tslint:disable-next-line:max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    password: new FormControl(null, [Validators.minLength(7), Validators.required]),
    name : new FormControl(null, [Validators.minLength(4), Validators.required]),
    schoolClass : new FormControl(null, [Validators.pattern(/^\d{1,2}[hrgHRG]\d$/), Validators.required]),
    school : new FormControl(null, [Validators.minLength(5), Validators.required])
  });

  right = null;
  errortext = '';
  private backendSignIn: BackendSigin;
  backendSession: BackendSession;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute('sign_in');
    this.backendSignIn = new BackendSigin(this.client, this);
    this.backendSession = new BackendSession(this.client, this);
    this.backendSession.check_session();
  }

  sign_in() {
    const pwd = this.signInForm.controls.password;
    const email = this.signInForm.controls.email;
    const name = this.signInForm.controls.name;
    const schoolClass = this.signInForm.controls.schoolClass;
    const school = this.signInForm.controls.school;

    if (pwd.valid && email.valid && name.valid && schoolClass.valid && school.valid) {
      this.backendSignIn.sign_in(pwd.value, email.value, name.value, school.value, schoolClass.value);
      this.signInForm.reset();
    }
  }

}
