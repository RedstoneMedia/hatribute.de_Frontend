import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { PopupData } from './pop-up-data';

@Component({
  selector: 'app-pop-up-wrapper',
  templateUrl: './pop-up-wrapper.component.html',
  styleUrls: ['./pop-up-wrapper.component.scss']
})
export class PopUpWrapperComponent implements OnInit {
  @Input() template: TemplateRef<any>;
  @Input() popupData: PopupData;

  constructor() { }

  ngOnInit(): void {}

  close() {
    this.popupData.close();
  }

}
