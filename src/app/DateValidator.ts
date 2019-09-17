import { AbstractControl } from '@angular/forms';

export function ValidateDate(control: AbstractControl) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const selectedDate = new Date(control.value);
  if (selectedDate < now) {
    return {datePassed : true};
  }
  return null;
}
