import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DataService {

  private curRouteSource = new BehaviorSubject('');
  curRoute = this.curRouteSource.asObservable();
  private loggedInSource = new BehaviorSubject(false);
  currentlyLoggedIn = this.loggedInSource.asObservable();

  constructor() {}

  changeCurRoute(route: string) {
    this.curRouteSource.next(route);
  }

  changeLoggedIn(loggedIn: boolean) {
    this.loggedInSource.next(loggedIn);
  }

}
