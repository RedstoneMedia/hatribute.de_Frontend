import { ObjectTableListDisplayOptions, ObjectTableListDisplayOptionsAction } from './ObjectTableListDisplayOptions';
import { Constants } from './../../constants';
import { PopupData } from './../../pop-up-wrapper/pop-up-data';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../dataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-object-table-list-display',
  templateUrl: './object-table-list-display.component.html',
  styleUrls: ['./object-table-list-display.component.scss']
})
export class ObjectTableListDisplayComponent implements OnInit {
  @Input() objects;
  @Input() displayOptions: ObjectTableListDisplayOptions;
  objectEditPopUpData: PopupData;
  currentObject: any;
  adminReadOnlyKeys = Constants.adminReadOnlyKeys;

  constructor(private client: HttpClient, protected data: DataService, protected router: Router) {}

  ngOnInit(): void {
    this.objectEditPopUpData = new PopupData(this.displayOptions.tableName);
  }

  openObjectEditPopUp(object: any): void {
    this.currentObject = object;
    this.objectEditPopUpData.open();
  }

  writeObjectChanges(): void {
    this.displayOptions.writeChangesFunction(this.currentObject);
    this.objectEditPopUpData.close();
  }

  executeAction(action: ObjectTableListDisplayOptionsAction): void {
    action.execute(this.currentObject);
    if (action.doClosePopup) {
      this.objectEditPopUpData.close();
    }
  }

  changeObjectEditPopUpInputValue(key, event): void {
    try {
      this.currentObject[key] = JSON.parse(event.srcElement.value);
    } catch (SyntaxError) {
      if (typeof this.currentObject[key] === "string") {
        this.currentObject[key] = event.srcElement.value;
      } else {
        event.srcElement.value = this.currentObject[key];
      }
    }
  }

}
