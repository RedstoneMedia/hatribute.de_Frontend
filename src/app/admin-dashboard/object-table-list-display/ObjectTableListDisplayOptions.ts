import { FormControl, FormGroup } from '@angular/forms';

export abstract class ObjectTableListDisplayCondition {
  abstract checkCondition(currentObject: any): boolean;
}


export class ObjectTableListDisplayWhenKeyIsEqualToConditon extends ObjectTableListDisplayCondition {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    super();
    this.key = key;
    this.value = value;
  }

  checkCondition(currentObject: any): boolean {
    return currentObject[this.key] === this.value;
  }
}


export class ObjectTableListDisplayOptionsAction {

  actionName: string;
  doClosePopup: boolean;
  displayConditions = new Array<ObjectTableListDisplayCondition>();
  actionExecuteFunction: (currentObject: any) => void;

  constructor(actionName: string, actionExecuteFunction: (currentObject: any) => void, doClosePopup: boolean = false) {
    this.actionName = actionName;
    this.actionExecuteFunction = actionExecuteFunction;
    this.doClosePopup = doClosePopup;
  }

  addCondition(condition: ObjectTableListDisplayCondition): void {
    this.displayConditions.push(condition);
  }

  canDisplay(currentObject: any): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.displayConditions.length; i++) {
      const condition = this.displayConditions[i];
      if (condition.checkCondition(currentObject) === false) {
        return false;
      }
    }
    return true;
  }

  execute(currentObject: any): void {
    if (this.canDisplay(currentObject)) {
      this.actionExecuteFunction(currentObject);
    }
  }
}


export class ObjectTableListDisplayAddInputInfo {
  displayName: string;
  placeholderText: string;
  formControl: FormControl;

  constructor(displayName: string, formControl: FormControl, placeholderText: string = "") {
    this.displayName = displayName;
    this.formControl = formControl;
    this.placeholderText = placeholderText;
  }
}

export class ObjectTableListDisplayAddPopupInfo {
  inputMap = new Map<string, ObjectTableListDisplayAddInputInfo>();
  addFunction: (data: any) => void;
  addText: string;

  constructor(addFunction: (data: any) => void, addText: string) {
    this.addFunction = addFunction;
    this.addText = addText;
  }

  addInputToPopup(keyName: string, inputInfo: ObjectTableListDisplayAddInputInfo): void {
    this.inputMap.set(keyName, inputInfo);
  }

  getFormGroup(): FormGroup {
    const formControlsMap = {};
    for (const keyName of Array.from(this.inputMap.keys()) ) {
      const inputInfo = this.inputMap.get(keyName);
      formControlsMap[keyName] = inputInfo.formControl;
    }
    const newFormGroup = new FormGroup(formControlsMap);
    return newFormGroup;
  }

  addObjectFromDataInForms(): boolean {
    const data = {};
    for (const keyName of Array.from(this.inputMap.keys()) ) {
      const formControl = this.inputMap.get(keyName).formControl;
      if (formControl.valid !== true) {
        return false;
      }
      data[keyName] = formControl.value;
    }
    this.addFunction(data);
    return true;
  }
}


export class ObjectTableListDisplayOptions {
  tableName: string;
  tableColumnsMap = new Map<string, string>();
  readOnlyKeys: string[];
  writeChangesFunction: (currentObject: any) => void;
  styleConditionsMap = new Map<ObjectTableListDisplayCondition, any>();
  actions = new Array<ObjectTableListDisplayOptionsAction>();
  addPopupInfo: ObjectTableListDisplayAddPopupInfo;

  constructor(tableName: string, writeChangesFunction: (currentObject: any) => void, readOnlyKeys: string[] = [], addPopupInfo: ObjectTableListDisplayAddPopupInfo = null) {
    this.tableName = tableName;
    this.writeChangesFunction = writeChangesFunction;
    this.readOnlyKeys = readOnlyKeys;
    this.addPopupInfo = addPopupInfo;
  }

  addColumn(objectKey: string, displayName: string): void {
    this.tableColumnsMap.set(objectKey, displayName);
  }

  addAction(action: ObjectTableListDisplayOptionsAction): void {
    this.actions.push(action);
  }

  addStyleCondition(condition: ObjectTableListDisplayCondition, style: any): void {
    this.styleConditionsMap.set(condition, style);
  }

  getCurrentStyleFromStyleConditions(currentObject: any): any {
    for (const condition of Array.from(this.styleConditionsMap.keys()) ) {
      if (condition.checkCondition(currentObject)) {
        return this.styleConditionsMap.get(condition);
      }
    }
    return "";
  }
}
