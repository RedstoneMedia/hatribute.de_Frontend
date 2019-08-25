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
      succsesFunction();
    }, (error: any) => {
      errorFunction();
      this.host.router.navigate(['login']);
    });
  }

  add_homework(exercise: string, subject, subExercises: any, succsesFunction) {
    const jsonData = {
      "exercise" : exercise,
      "subject" : subject,
      "subExercises" : subExercises
    };
    this.post_with_session(jsonData, "add_homework", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  register_for_sub_homework(homeworkId: number, subHomeworkId: number, succsesFunction) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "register_for_sub_homework", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

}
