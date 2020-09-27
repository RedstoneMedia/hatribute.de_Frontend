import { PopupData } from './../pop-up-wrapper/pop-up-data';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendHomework } from './BackendHomework';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateDate } from '../DateValidator';


@Component({
  selector: 'app-homeworklist',
  templateUrl: './homeworklist.component.html',
  styleUrls: ['./homeworklist.component.scss']
})

export class HomeworklistComponent implements OnInit {

  backendSchoolClass: BackendHomework;
  homework: any;
  courses: any;
  curSlectedHomework: any;
  curUploadSubHomework: any;
  curSubHomeworkDisplay: any;
  usingBase64ImageLoading = false;
  addHomeworkModal: boolean;
  homeworkUploadFiles: any;
  UserData: any;
  notEnougthPoints = false;
  report: boolean;

  HomworkDetailPopUpData: PopupData;
  HomworkViewPopUpData: PopupData;
  HomworkReportPopUpData: PopupData;
  HomworkUploadPopUpData: PopupData;
  HomworkAddPopUpData: PopupData;

  AddHomeworkForm = new FormGroup({
    Exercise : new FormControl(null, [Validators.required, Validators.minLength(4)]),
    Course : new FormControl(null, [Validators.required]),
    DueDate : new FormControl(null, [ValidateDate, Validators.required]),
    SubExercise : new FormControl(null, [])
  });

  ReportForm = new FormGroup({
    Type : new FormControl(null, [Validators.required])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.HomworkDetailPopUpData = new PopupData("Hausaufgaben");
    this.HomworkViewPopUpData = new PopupData("Hausaufgabe");
    this.HomworkReportPopUpData = new PopupData("Report");
    this.HomworkUploadPopUpData = new PopupData("Hochladen");
    this.HomworkAddPopUpData = new PopupData("Hausaufgabe hinzufügen");
    this.data.changeCurRoute("homework-list");
    this.backendSchoolClass = new BackendHomework(this.client, this);
    this.backendSchoolClass.get_user_courses(() => {
        this.backendSchoolClass.post_with_session_no_data("get_data", (data: any) => {
          this.UserData = data.user;
          this.data.changeRole(data.user.role);
          this.updateCanDelete();
      }, (error) => {
        console.log(error);
        this.router.navigate(['login']);
      });
    }, () => {});
  }

  updateCanDelete() {
    this.homework.forEach(element => {
      if (this.UserData.role >= 3) {
        element["CanDelete"] = true;
      } else {
        if (element.CreatorId === this.UserData.id) {
          let good = true;
          if (element.SubHomework !== undefined) {
            for (let i = 0; i < element.SubHomework.length; i++) {
              const subHomework = element.SubHomework[i];
              if (subHomework.Done === true) {
                good = false;
                break;
              }
            }
          }
          element["CanDelete"] = good;
        } else {
          element["CanDelete"] = false;
        }
      }
    });
  }

  showHomeworkDetails(index: number) {
    this.curSlectedHomework = this.homework[index];
    this.HomworkDetailPopUpData.open();
  }

  closeHomeworkDetails() {
    this.curSlectedHomework = null;
    this.HomworkDetailPopUpData.close();
  }

  deleteHomwork() {
    this.backendSchoolClass.delete_homework(this.curSlectedHomework.id, () => {
      this.backendSchoolClass.get_user_courses(() => {
        this.updateCanDelete();
      }, () => {});
    });
    this.closeHomeworkDetails();
  }

  showUploadSubHomework(i) {
    this.curUploadSubHomework = this.curSlectedHomework.SubHomework[i];
    this.HomworkUploadPopUpData.open();
  }

  closeUploadSubHomework() {
    this.curUploadSubHomework = null;
    this.HomworkUploadPopUpData.close();
  }

  showSubHomework(i) {
    this.curSubHomeworkDisplay = this.curSlectedHomework.SubHomework[i];
    this.HomworkViewPopUpData.open();
  }

  notEnoughtPointsImageDisplay(notEnoughtPoints: boolean) {
    if (notEnoughtPoints) {
      this.notEnougthPoints = true;
      this.curSubHomeworkDisplay = null;
      this.HomworkViewPopUpData.close();
    }
  }

  closeSubHomework() {
    this.curSubHomeworkDisplay = null;
    this.HomworkViewPopUpData.close();
  }

  onImageUploadChange(files) {
    this.homeworkUploadFiles = files;
  }

  uploadHomworkImage() {
    const allowedFileExtensions = ["png", "jpg", "jepg", "gif"];
    let imageNameValid = false;

    if (this.homeworkUploadFiles.length > 0) {
      for (let i = 0; i < allowedFileExtensions.length; i++) {
        const extension = allowedFileExtensions[i];
        for (let j = 0; j < this.homeworkUploadFiles.length; j++) {
          const homeworkUploadFile = this.homeworkUploadFiles[j];
          if (homeworkUploadFile.name.toLowerCase().endsWith(extension)) {
            imageNameValid = true;
            break;
          }
        }
      }
    }

    if (imageNameValid) {
      // tslint:disable-next-line: max-line-length
      this.curUploadSubHomework.Done = true;
      const subHomeworkCount = this.curSlectedHomework.SubHomework.length;
      let doneSubHomeworkCount = 0;
      this.curSlectedHomework.SubHomework.forEach(element => {
        if (element.Done) {
          doneSubHomeworkCount++;
        }
      });

      this.curSlectedHomework.DonePercentage = Math.round((doneSubHomeworkCount / subHomeworkCount) * 100);
      // tslint:disable-next-line: max-line-length
      this.backendSchoolClass.upload_sub_homework(this.curSlectedHomework.id, this.curUploadSubHomework.id, this.homeworkUploadFiles, () => {}, () => {});
      this.closeUploadSubHomework();
    }
  }

  registerForSubHomework(i) {
    this.backendSchoolClass.register_for_sub_homework(this.curSlectedHomework.id, this.curSlectedHomework.SubHomework[i].id, () => {
      this.curSlectedHomework.SubHomework[i].User.name = this.UserData.name;
    }, (user) => {
      this.curSlectedHomework.SubHomework[i].User = user; // someone has already registered for this homework
    });
  }

  deRegisterForSubHomework(i) {
    this.curSlectedHomework.SubHomework[i].User.name = null;
    this.backendSchoolClass.de_register_for_sub_homework(this.curSlectedHomework.id, this.curSlectedHomework.SubHomework[i].id, () => {
      this.backendSchoolClass.get_user_courses(() => {
        this.closeHomeworkDetails();
      }, () => {});
    });
  }

  addHomework() {
    // Generate subExercises
    const subExercisesRaw = [];
    let validSubExercises = true;
    const subExercise = this.AddHomeworkForm.controls.SubExercise.value;
    if (subExercise !== null) {
      subExercise.split(" ").forEach(element => {
        element = element.replace(" ", "");
        element = element.toLowerCase();
        if (element.charAt(1) === '-') {
          if (!(element.charCodeAt(0) > element.charCodeAt(2))) {
            for (let i = element.charCodeAt(0); i < element.charCodeAt(2) + 1; i++) {
              subExercisesRaw.push( String.fromCharCode(i));
            }
          } else {
            validSubExercises = false;
          }
        } else if (element.charAt(1) === '+') {
          subExercisesRaw.push(element.charAt(0));
          subExercisesRaw.push(element.charAt(2));
        }
      });
    }

    if (subExercise === null || subExercise.length <= 0) {
      subExercisesRaw.push(this.AddHomeworkForm.controls.Exercise.value);
    }

    // tslint:disable-next-line: max-line-length
    if ( this.AddHomeworkForm.controls.Exercise.valid && this.AddHomeworkForm.controls.Course.valid && validSubExercises && this.AddHomeworkForm.controls.DueDate.valid) {
      // tslint:disable-next-line: max-line-length
      this.backendSchoolClass.add_homework(this.AddHomeworkForm.controls.Exercise.value, this.AddHomeworkForm.controls.Course.value, subExercisesRaw, this.AddHomeworkForm.controls.DueDate.value, () => {
        this.backendSchoolClass.get_user_courses(() => {
          this.AddHomeworkForm.reset();
          this.updateCanDelete();
          this.closeAddHomework();
        }, () => {});
      });
    }
  }

  showAddHomework() {
    this.addHomeworkModal = true;
    this.HomworkAddPopUpData.open();
  }

  closeAddHomework() {
    this.addHomeworkModal = false;
    this.HomworkAddPopUpData.close();
  }

  showReport() {
    this.report = true;
    this.HomworkReportPopUpData.open();
  }

  closeReport() {
    this.report = false;
    this.HomworkReportPopUpData.close();
  }

  addReport() {
    if (this.ReportForm.controls.Type.valid) {
      const typeString = this.ReportForm.controls.Type.value;
      const type = Number.parseFloat(typeString.split('.')[0]);
      this.backendSchoolClass.report_sub_image(this.curSlectedHomework.id, this.curSubHomeworkDisplay.id, type, () => {
        this.backendSchoolClass.get_user_courses(() => {
          this.ReportForm.reset();
          this.closeReport();
          this.closeSubHomework();
          this.closeHomeworkDetails();
        }, () => {});
      });
    }
  }

}
