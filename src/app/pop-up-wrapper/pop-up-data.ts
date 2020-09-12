export class PopupData {

  isOpen: boolean;
  title: string;

  constructor(title: string) {
    this.isOpen = false;
    this.title = title;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
