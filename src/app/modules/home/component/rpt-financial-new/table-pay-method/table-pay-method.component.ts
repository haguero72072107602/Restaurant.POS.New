import {Component, Input} from '@angular/core';
import {MediaData} from "@models/media.data";

@Component({
  selector: 'app-table-pay-method',
  standalone: true,
  imports: [],
  templateUrl: './table-pay-method.component.html',
  styleUrl: './table-pay-method.component.css'
})
export class TablePayMethodComponent {
  //@Input({required: true}) payMethod : number | undefined
  @Input({required: true}) payMethodData : MediaData[] | undefined
}
