import { HttpClient } from '@angular/common/http';
import { BackendSession } from '../BackendSession';
import { HomeworklistComponent } from './homeworklist.component';

export class BackendSchoolClass extends BackendSession {

  constructor(client: HttpClient, host: any, adrress = 'desktop-2d4qv4n.​kg0tg33tqt4rgjsp.​myfritz.​net', port = 3182) {
    super(client, host, adrress);
  }

  get_school_class_data(succsesFunction, errorFunction) {
    this.post_with_session_no_data("get_school_class", (data: any) => {
      this.host.schoolClass = data.school_class;
      succsesFunction(data);
    }, (error: any) => {
      errorFunction(error);
      this.host.router.navigate(['login']);
    });
  }

  add_homework(exercise: string, subject, subExercises: any, DueDate: string, succsesFunction) {
    const jsonData = {
      "exercise" : exercise,
      "subject" : subject,
      "subExercises" : subExercises,
      "dueDate" : DueDate
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

  de_register_for_sub_homework(homeworkId: number, subHomeworkId: number, succsesFunction) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "de_register_for_sub_homework", (data: any) => {
      succsesFunction();
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  upload_sub_homework(homeworkId: number, subHomeworkId: number, files: any, sucsessFunction, errorFunction) {
    const jsondata = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId,
      "base64Files" : []
    };
    files.forEach(file => {
      jsondata.base64Files.push(file.base64);
    });

    this.post_with_session(jsondata, "upload_sub_homework", (data: any) => {
      sucsessFunction(data);
    }, (error: any) => {
      errorFunction(error);
    });
  }

  get_sub_homework_images_url(homeworkId: number, subHomeworkId: number, succsesFunction, noPointsErrorFuntion) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "get_sub_homework_images_url", (data: any) => {
      succsesFunction(data);
    }, (error: any) => {
      if (error.status === 403) {
        const session = error.error.session;
        if (localStorage["session-id"] != null) {
          localStorage["session-id"] = session.session;
          localStorage["session-expires"] = session.expires;
        }
        sessionStorage["session-id"] = session.session;
        sessionStorage["session-expires"] = session.expires;
        this.host.data.changeLoggedIn(true);
        noPointsErrorFuntion(error);
      } else {
        this.host.router.navigate(['login']);
      }
    });
  }

  get_sub_homework_base64_images(homeworkId: number, subHomeworkId: number, succsesFunction, noPointsErrorFuntion) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "get_sub_homework_base64_images", (data: any) => {
      succsesFunction(data);
    }, (error: any) => {
      if (error.status === 403) {
        const session = error.error.session;
        if (localStorage["session-id"] != null) {
          localStorage["session-id"] = session.session;
          localStorage["session-expires"] = session.expires;
        }
        sessionStorage["session-id"] = session.session;
        sessionStorage["session-expires"] = session.expires;
        this.host.data.changeLoggedIn(true);
        noPointsErrorFuntion(error);
      } else {
        this.host.router.navigate(['login']);
      }
    });
  }

  delete_homework(homeworkId: number, succsesFunction) {
    const jsonData = {
      "homework_id" : homeworkId
    };
    this.post_with_session(jsonData, "delete_homework", (data: any) => {
      if (data.success === true) {
        succsesFunction();
      } else {
        console.error(data);
      }
    }, (error: any) => {
      this.host.router.navigate(['login']);
    });
  }

  report_sub_image(homeworkId: number, subHomeworkId: number, type: number, sucsessFunction) {
    const jsondata = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId,
      "type" : type
    };
    this.post_with_session(jsondata, "report_sub_image", (data: any) => {
      sucsessFunction(data);
    }, (error: any) => {
      console.error(error);
      this.host.router.navigate(['login']);
    });
  }
}
