import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageObjToImagePath'
})
export class ImageObjToImagePathPipe implements PipeTransform {

  private backendAdress = "192.168.178.23";
  private backendPort = 31812;

  transform(image_obj: any, args?: any): any {
    // tslint:disable-next-line: max-line-length
    return `https://${this.backendAdress}:${this.backendPort}/get_sub_homework_image?image_count=${image_obj.index}&sub_homework_id=${image_obj.sub_homework_id}`;
  }

}
