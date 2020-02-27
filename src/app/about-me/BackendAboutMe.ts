import { HttpClient } from '@angular/common/http';
import { AboutMeComponent } from './about-me.component';
import { BackendSession } from '../BackendSession';

export class BackendAboutMe extends BackendSession {

  constructor(client: HttpClient, host, adrress = 'desktop-2d4qv4n.​kg0tg33tqt4rgjsp.​myfritz.​net', port = 3182) {
    super(client, host, adrress);
  }

  logout(succsesFunction: any, errorFunction: any) {
    this.post_with_session_no_data("logout", (data: any) => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      localStorage.clear();
      this.host.router.navigate(['']);
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
      errorFunction();
    });
  }


  delete_account(succsesFunction: any, errorFunction: any) {
    this.post_with_session_no_data("delete_account", (data: any) => {
      this.host.data.changeLoggedIn(false);
      sessionStorage.removeItem("session-id");
      sessionStorage.removeItem("session-expires");
      this.host.router.navigate(['']);
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
      errorFunction();
    });
  }
}
