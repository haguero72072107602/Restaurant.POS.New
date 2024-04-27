import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {Department} from "@models/department.model";
import {DomSanitizer} from "@angular/platform-browser";


@Pipe({
  standalone: true,
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string): any {
    const imageValue = this.sanitizer.sanitize(SecurityContext.NONE,
      this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + value));

    console.log("Conversion ->", imageValue);

    return imageValue;
    /*
    return value != undefined ?
      this.sanitizer.sanitize(SecurityContext.NONE,
        this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + value))
      : undefined
   */
  }

}

