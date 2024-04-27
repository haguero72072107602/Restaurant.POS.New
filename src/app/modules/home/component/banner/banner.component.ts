import {Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true

})
export class BannerComponent {
  @Input() slides?: any[] = [];
}
