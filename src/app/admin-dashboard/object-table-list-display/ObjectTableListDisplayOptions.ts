
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


export class ObjectTableListDisplayOptions {
  tableName: string;
  tableColumnsMap = new Map<string, string>();
  readOnlyKeys: string[];
  writeChangesFunction: (currentObject: any) => void;
  styleConditionsMap = new Map<ObjectTableListDisplayCondition, any>();
  actions = new Array<ObjectTableListDisplayOptionsAction>();

  constructor(tableName: string, writeChangesFunction: (currentObject: any) => void, readOnlyKeys: string[] = []) {
    this.tableName = tableName;
    this.writeChangesFunction = writeChangesFunction;
    this.readOnlyKeys = readOnlyKeys;
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
