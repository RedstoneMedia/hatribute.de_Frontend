import { HttpClient } from '@angular/common/http';
import { BackendSession } from '../BackendSession';
import { HomeworklistComponent } from './homeworklist.component';

export class BackendSchoolClass extends BackendSession {

  constructor(client: HttpClient, host: HomeworklistComponent, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress);
  }

  get_school_class_data(succsesFunction, errorFunction) {
    this.post_with_session_no_data("get_school_class", (data: any) => {
      this.host.schoolClass = data.school_class;
      console.log(this.host.schoolClass);
      succsesFunction();
    }, (error: any) => {
      errorFunction();
      this.host.router.navigate(['login']);
    });
  }
}
