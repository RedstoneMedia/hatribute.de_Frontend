import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DataService {

  private curRouteSource = new BehaviorSubject('');
  curRoute = this.curRouteSource.asObservable();
  private loggedInSource = new BehaviorSubject(false);
  currentlyLoggedIn = this.loggedInSource.asObservable();
  private currentRoleSource = new BehaviorSubject(-2);
  currentRole = this.currentRoleSource.asObservable();
  private isBusy = false;
  private tasks = [];

  constructor() {
    setInterval(() => {
      if (!this.isBusy) {
        if (this.tasks.length > 0) {
          this.isBusy = true;
          const task = this.tasks.pop();
          task();  // this task will have to call doneWithTask() to signal that it has ended, so the next task can be processed.
        }
      }
    }, 100);
  }

  doneWithTask() {
    this.isBusy = false;
  }

  pushAsyncTaskToBeSynchronouslyExecuted(task) {
    this.tasks.push(task);
  }

  changeCurRoute(route: string) {
    this.curRouteSource.next(route);
  }

  changeLoggedIn(loggedIn: boolean) {
    this.loggedInSource.next(loggedIn);
  }

  changeRole(role: number) {
    this.currentRoleSource.next(role);
  }

}
