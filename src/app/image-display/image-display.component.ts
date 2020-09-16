import { BackendHomework } from './../homeworklist/BackendHomework';
import { Component, OnInit, Input, EventEmitter , Output} from '@angular/core';
import { DataService } from '../dataService';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";


@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent implements OnInit {

  @Input() subHomeworkDisplay: any;
  @Input() backendHomework: BackendHomework;
  @Output() notEnoughtPoints = new EventEmitter<boolean>();
  usingBase64ImageLoading = false;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) {}

  ngOnInit(): void {
    this.displayImages();
  }

  displayImages() {
    this.usingBase64ImageLoading = false;
    this.subHomeworkDisplay["imageUrls"] = [];
    const start = new Date().getTime();
    this.backendHomework.get_sub_homework_images_url(this.subHomeworkDisplay.id, this.subHomeworkDisplay.id, (data) => {
      for (let j = 0; j < data.images_total; j++) {
        this.subHomeworkDisplay.imageUrls.push(`/${data.images_url}/${j}.jpg`);
      }
      const end = new Date().getTime();
      const time = end - start;
      if (time > 200) { // if request took longer then 200 ms use other method to display images
        console.log(`Request took to long : ${time}ms using base64 to load images instead`);
        // Now trying to load images again but with the base64 image method
        this.usingBase64ImageLoading = true;
        this.backendHomework.get_sub_homework_base64_images(this.subHomeworkDisplay.id, this.subHomeworkDisplay.id, (data) => {
          // setting base64 images so they can be displayed
          this.subHomeworkDisplay["base64_images"] = data.base64_images;
        }, (error) => {
          this.notEnoughtPoints.emit(true);
        });

      }
    }, (error) => {
      this.notEnoughtPoints.emit(true);
    });
  }

}
