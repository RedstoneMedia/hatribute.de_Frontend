import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataService } from './dataService';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { AboutMeComponent } from './about-me/about-me.component';

const myRoutes: Routes = [
  {path : '', component: StartComponent},
  {path : 'login', component: LoginComponent},
  {path : 'sign-in', component: SigninComponent},
  {path : 'about-me', component: AboutMeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StartComponent,
    LoginComponent,
    SigninComponent,
    AboutMeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(myRoutes , { useHash: true })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
