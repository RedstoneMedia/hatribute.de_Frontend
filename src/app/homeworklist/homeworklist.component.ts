import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendSchoolClass } from './BackendSchoolClass';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateDate } from '../DateValidator';


@Component({
  selector: 'app-homeworklist',
  templateUrl: './homeworklist.component.html',
  styleUrls: ['./homeworklist.component.scss']
})

export class HomeworklistComponent implements OnInit {

  backendSchoolClass: BackendSchoolClass;
  schoolClass: any;
  curSlectedHomework: any;
  curUploadSubHomework: any;
  curSubHomeworkDisplay: any;
  addHomeworkModal: boolean;
  homeworkUploadFiles: any;
  UserData: any;
  notEnougthPoints = false;
  report: boolean;

  AddHomeworkForm = new FormGroup({
    Exercise : new FormControl(null, [Validators.required, Validators.minLength(4)]),
    Subject : new FormControl(null, [Validators.required]),
    DueDate : new FormControl(null, [ValidateDate, Validators.required]),
    SubExercise : new FormControl(null, [])
  });

  ReportForm = new FormGroup({
    Type : new FormControl(null, [Validators.required])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("homework-list");
    this.backendSchoolClass = new BackendSchoolClass(this.client, this);
    this.backendSchoolClass.get_school_class_data(() => {
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
    this.schoolClass.homework.forEach(element => {
      if (this.UserData.role >= 2) {
        element["CanDelete"] = true;
      } else {
        if (element.CreatorId === this.UserData.id) {
          let good = true;
          if (this.schoolClass.homework.SubHomework !== undefined) {
            for (let i = 0; i < this.schoolClass.homework.SubHomework.length; i++) {
              const subHomework = this.schoolClass.homework.SubHomework[i];
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
    this.curSlectedHomework = this.schoolClass.homework[index];
  }

  closeHomeworkDetails() {
    this.curSlectedHomework = null;
  }

  deleteHomwork() {
    this.backendSchoolClass.delete_homework(this.curSlectedHomework.id, () => {
      this.backendSchoolClass.get_school_class_data(() => {
        this.updateCanDelete();
      }, () => {});
    });
    this.closeHomeworkDetails();
  }

  showUploadSubHomework(i) {
    this.curUploadSubHomework = this.curSlectedHomework.SubHomework[i];
  }

  closeUploadSubHomework() {
    this.curUploadSubHomework = null;
  }

  showSubHomework(i) {
    this.curSubHomeworkDisplay = this.curSlectedHomework.SubHomework[i];
    this.curSubHomeworkDisplay["imageUrls"] = [];
    this.backendSchoolClass.get_sub_homework_images_url(this.curSlectedHomework.id, this.curSubHomeworkDisplay.id, (data) => {
      for (let j = 0; j < data.images_total; j++) {
        this.curSubHomeworkDisplay.imageUrls.push(`\\${data.images_url}\\${j}.png`);
      }
    }, (error) => {
      this.notEnougthPoints = true;
      this.closeSubHomework();
    });
  }

  closeSubHomework() {
    this.curSubHomeworkDisplay = null;
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
    this.curSlectedHomework.SubHomework[i].User.name = this.UserData.name;
    this.backendSchoolClass.register_for_sub_homework(this.curSlectedHomework.id, this.curSlectedHomework.SubHomework[i].id, () => {});
  }

  deRegisterForSubHomework(i) {
    this.curSlectedHomework.SubHomework[i].User.name = null;
    this.backendSchoolClass.de_register_for_sub_homework(this.curSlectedHomework.id, this.curSlectedHomework.SubHomework[i].id, () => {
      this.backendSchoolClass.get_school_class_data(() => {
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
    if ( this.AddHomeworkForm.controls.Exercise.valid && this.AddHomeworkForm.controls.Subject.valid && validSubExercises && this.AddHomeworkForm.controls.DueDate.valid) {
      // tslint:disable-next-line: max-line-length
      this.backendSchoolClass.add_homework(this.AddHomeworkForm.controls.Exercise.value, this.AddHomeworkForm.controls.Subject.value, subExercisesRaw, this.AddHomeworkForm.controls.DueDate.value, () => {
        this.backendSchoolClass.get_school_class_data(() => {
          this.AddHomeworkForm.reset();
          this.updateCanDelete();
          this.closeAddHomework();
        }, () => {});
      });
    }
  }

  showAddHomework() {
    this.addHomeworkModal = true;
  }

  closeAddHomework() {
    this.addHomeworkModal = false;
  }

  showReport() {
    this.report = true;
  }

  closeReport() {
    this.report = false;
  }

  addReport() {
    if (this.ReportForm.controls.Type.valid) {
      const typeString = this.ReportForm.controls.Type.value;
      const type = Number.parseFloat(typeString.split('.')[0]);
      this.backendSchoolClass.report_sub_image(this.curSlectedHomework.id, this.curSubHomeworkDisplay.id, type, () => {
        this.backendSchoolClass.get_school_class_data(() => {
          this.ReportForm.reset();
          this.closeReport();
          this.closeSubHomework();
          this.closeHomeworkDetails();
        }, () => {});
      });
    }
  }

}
