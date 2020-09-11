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
import { HomeworklistComponent } from './homeworklist/homeworklist.component';

import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { Base64ImageSafePipe } from './base64-image-safe.pipe';

import { ValidateDate } from './DateValidator';
import { ModDashboardComponent } from './mod-dashboard/mod-dashboard.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const myRoutes: Routes = [
  {path : '', component: StartComponent},
  {path : 'login', component: LoginComponent},
  {path : 'sign-in', component: SigninComponent},
  {path : 'about-me', component: AboutMeComponent},
  {path : 'homework-list', component: HomeworklistComponent},
  {path : 'mod-dashboard', component: ModDashboardComponent},
  {path : 'admin-dashboard', component: AdminDashboardComponent},
  {path : 'knowledge', component: KnowledgeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StartComponent,
    LoginComponent,
    SigninComponent,
    AboutMeComponent,
    HomeworklistComponent,
    Base64ImageSafePipe,
    ModDashboardComponent,
    KnowledgeComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlifeFileToBase64Module,
    RouterModule.forRoot(myRoutes , { useHash: true })
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
