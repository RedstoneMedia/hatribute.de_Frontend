import { BackendModDashboard } from './../mod-dashboard/BackendModDashboard';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';

export class BackendAdminDashboard extends BackendModDashboard {

  constructor(client: HttpClient, host: any, adrress = Constants.backendUrl, port = 3182) {
    super(client, host, adrress);
  }

  writeUserChanges(userChangeData, successFunction: any): void {
    const jsonData = {
      user_changes : userChangeData
    };
    this.post_with_session(jsonData, "write_user_changes", (data: any) => {
      successFunction(data);
    }, (error: any) => {
      console.error(error);
    });
  }

  generateNewTokenForDeactivatedUser(userId: number, successFunction: any): void {
    const jsonData = {
      user_id : userId
    };
    this.post_with_session(jsonData, "generate_new_token_for_deactivated_user", (data: any) => {
      successFunction(data.new_first_time_sign_in_token);
    }, (error: any) => {
      console.error(error);
    });
  }

  setupNewUser(userName: string, schoolName: string, successFunction: any): void {
    const jsonData = {
      user_name : userName,
      school_name : schoolName
    };
    this.post_with_session(jsonData, "setup_new_user", (data: any) => {
      successFunction(data);
    }, (error: any) => {
      console.error(error);
    });
  }

  removeDeactivatedUser(userId: number, successFunction: any): void {
    const jsonData = {
      user_id : userId,
    };
    this.post_with_session(jsonData, "remove_deactivated_account", (data: any) => {
      successFunction(data);
    }, (error: any) => {
      console.error(error);
    });
  }
}
