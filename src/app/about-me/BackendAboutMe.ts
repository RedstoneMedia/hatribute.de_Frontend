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

  get_time_table(units_username, units_password, succsesFunction: any, errorFunction: any) {
    const json_data = {
      "units_username" : units_username,
      "units_password" : units_password
    };
    this.post_with_session(json_data, "get_time_table", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      console.error(error);
      errorFunction(error);
    });
  }

  get_time_table_download_info(succsesFunction: any, errorFunction: any) {
    this.post_with_session_no_data("get_time_table_download_info", (data: any) => {
      succsesFunction(data);
    }, (error: any) => {
      console.error(error);
      errorFunction(error);
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
