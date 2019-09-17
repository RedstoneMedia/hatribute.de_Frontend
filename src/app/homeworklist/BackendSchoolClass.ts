import { HttpClient } from '@angular/common/http';
import { BackendSession } from '../BackendSession';
import { HomeworklistComponent } from './homeworklist.component';

export class BackendSchoolClass extends BackendSession {

  constructor(client: HttpClient, host: HomeworklistComponent, adrress = '192.168.178.23', port = 31812) {
    super(client, host, adrress);
  }

  getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
    return weekNo;
}

  get_school_class_data(succsesFunction, errorFunction) {
    this.post_with_session_no_data("get_school_class", (data: any) => {
      this.host.schoolClass = data.school_class;
      /* Move this to the backend because it solws down
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      data.school_class.homework.forEach(homework => {
        const dueDate = new Date(homework.Due);
        // tslint:disable-next-line: max-line-length
        const weeksBetween = this.getWeekNumber(dueDate) - this.getWeekNumber(now);
        // tslint:disable-next-line: max-line-length
        const nDays = (Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000;
        if ((nDays >= -2 && nDays <= 2)) {
          switch (nDays) {
            case -2:
              homework.Due = "Vorgestern";
              break;
            case -1:
              homework.Due = "Gestern";
              break;
            case 0:
              homework.Due = "Heute";
              break;
            case 1:
              homework.Due = "Morgen";
              break;
            case 2:
              homework.Due = "Übermorgen";
          }
        } else if (weeksBetween <= 1) {
          homework.Due = "";
          if (weeksBetween === 1) {
            homework.Due = "Nächste Woche ";
          }
          switch (dueDate.getDay()) {
            case 1:
              homework.Due += "Montag";
              break;
            case 2:
              homework.Due += "Dienstag";
              break;
            case 3:
              homework.Due += "Mittwoch";
              break;
            case 4:
              homework.Due += "Donnerstag";
              break;
            case 5:
              homework.Due += "Freitag";
              break;
            case 6:
              homework.Due += "Sammstag, WTF ?";
              break;
            default:
                homework.Due += "Sonntag, WTF ?";
                break;
          }
        }
      });
      */
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

  get_sub_homework_images(homeworkId: number, subHomeworkId: number, succsesFunction, noPointsErrorFuntion) {
    const jsonData = {
      "homework_id" : homeworkId,
      "sub_homework_id" : subHomeworkId
    };
    this.post_with_session(jsonData, "get_sub_homework_images", (data: any) => {
      succsesFunction(data);
    }, (error: any) => {
      if (error.status === 403) {
        const session = error.error.session;
        sessionStorage["session-id"] = session.session;
        sessionStorage["session-expires"] = session.expires;
        this.host.data.changeLoggedIn(true);
        noPointsErrorFuntion(error);
      } else {
        this.host.router.navigate(['login']);
      }
    });
  }

}
