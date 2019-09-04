import { Component, OnInit } from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BackendSchoolClass } from './BackendSchoolClass';
import { FormGroup, FormControl, Validators } from '@angular/forms';


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

  AddHomeworkForm = new FormGroup({
    Exercise : new FormControl(null, [Validators.required, Validators.minLength(4)]),
    Subject : new FormControl(null, [Validators.required]),
    // tslint:disable-next-line: max-line-length
    SubExercise : new FormControl(null, [])
  });

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) { }

  ngOnInit() {
    this.data.changeCurRoute("homework-list");
    this.backendSchoolClass = new BackendSchoolClass(this.client, this);
    this.backendSchoolClass.get_school_class_data(() => {
        this.backendSchoolClass.post_with_session_no_data("get_data", (data: any) => {
        this.UserData = data.user;
      }, (error) => {
        console.log(error);
        this.router.navigate(['login']);
      });
    }, () => {});
  }

  showHomeworkDetails(index: number) {
    this.curSlectedHomework = this.schoolClass.homework[index];
  }

  closeHomeworkDetails() {
    this.curSlectedHomework = null;
  }

  showUploadSubHomework(i) {
    this.curUploadSubHomework = this.curSlectedHomework.SubHomework[i];
  }

  closeUploadSubHomework() {
    this.curUploadSubHomework = null;
  }

  showSubHomework(i) {
    this.curSubHomeworkDisplay = this.curSlectedHomework.SubHomework[i];
    this.curSubHomeworkDisplay["base64_images"] = [];
    this.backendSchoolClass.get_sub_homework_images(this.curSlectedHomework.id, this.curSubHomeworkDisplay.id, (data) => {
      this.curSubHomeworkDisplay["base64_images"] = data.base64_images;
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
    this.backendSchoolClass.de_register_for_sub_homework(this.curSlectedHomework.id, this.curSlectedHomework.SubHomework[i].id, () => {});
  }

  addHomework() {
    // Generate subExercises
    const subExercises = [];
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
              subExercises.push({Exercise : String.fromCharCode(i), User : {name : "Nicht Eingetragen"}, Done : false});
              subExercisesRaw.push( String.fromCharCode(i));
            }
          } else {
            validSubExercises = false;
          }
        } else if (element.charAt(1) === '+') {
          subExercises.push({Exercise : element.charAt(0), User : {name : null}, Done : false});
          subExercisesRaw.push(element.charAt(0));
          subExercises.push({Exercise : element.charAt(2), User : {name : null}, Done : false});
          subExercisesRaw.push(element.charAt(2));
        }
      });
    }

    if (subExercise === null || subExercise.length <= 0) {
      subExercises.push({Exercise : this.AddHomeworkForm.controls.Exercise.value, User : {name : null}, Done : false});
      subExercisesRaw.push(this.AddHomeworkForm.controls.Exercise.value);
    }

    // check if form is valid
    console.log(subExercises);
    if ( this.AddHomeworkForm.controls.Exercise.valid && this.AddHomeworkForm.controls.Subject.valid && validSubExercises) {
      const newHomework = {
        DonePercentage : 0,
        Due: "None",
        Exercise: this.AddHomeworkForm.controls.Exercise.value,
        Subject : this.AddHomeworkForm.controls.Subject.value,
        SubHomework: subExercises
      };
      this.schoolClass.homework.push(newHomework);
      // tslint:disable-next-line: max-line-length
      this.backendSchoolClass.add_homework(this.AddHomeworkForm.controls.Exercise.value, this.AddHomeworkForm.controls.Subject.value, subExercisesRaw, () => {
        this.backendSchoolClass.get_school_class_data(() => {
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

}
