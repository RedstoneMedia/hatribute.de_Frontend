import { HttpClient } from '@angular/common/http';
import { AboutMeComponent } from './about-me.component';
import { BackendSession } from '../BackendSession';

export class BackendAboutMe extends BackendSession {

  constructor(client: HttpClient, host: AboutMeComponent, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress);
  }

  logout(succsesFunction: any, errorFunction: any) {
    this.post_with_session_no_data("logout", (data: any) => {
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
