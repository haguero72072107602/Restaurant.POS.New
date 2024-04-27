import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {CdkConnectedOverlay, CdkOverlayOrigin} from "@angular/cdk/overlay";
import {CalendarComponent} from "@modules/home/component/button-date/calendar/calendar.component";

import {AsyncPipe} from "@angular/common";
import {fnFormatDate, fnPhaserDateFormat} from "@core/utils/functions/functions";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


@Component({
  selector: 'app-button-date',
  standalone: true,
  imports: [
    CdkOverlayOrigin,
    CalendarComponent,
    CdkConnectedOverlay,
    AsyncPipe
  ],
  templateUrl: './button-date.component.html',
  styleUrl: './button-date.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ButtonDateComponent,
    multi: true
  }]

})
export class ButtonDateComponent implements OnInit, ControlValueAccessor {

  value!: Date;
  disabled: boolean = false;
  onChange!: (value: Date) => void;
  onTouched!: () => void;


  @ViewChild("inputDate", {static: true}) inputDate!: ElementRef;
  isOpenDetail: boolean = false;

  constructor() {
    //this.dateValue = fnFormatDate(new Date(), false)
  }

  ngOnInit(): void {
    //if (this.dateValue)
    //{
    //  this.inputDate.nativeElement.value = this.dateValue
    //}
  }

  openDialog() {
    this.isOpenDetail = !this.isOpenDetail;
  }

  /*
  evChangeDate( $event : any) {
    console.log("Event ->", $event);
    this.inputDate.nativeElement.value =  fnPhaserDateFormat($event);
    this.isOpenDetail = false;
  }
  */

  writeValue(obj: any): void {
    this.value = obj
    this.updateControlValue(this.value)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setValue($event: Date) {
    debugger;
    if (!this.disabled) {
      this.value = $event;
      this.onChange(this.value)
      this.onTouched();
      this.isOpenDetail = false;
      this.updateControlValue(this.value)
    }
  }

  updateControlValue(value: Date) {
    this.inputDate.nativeElement.value = fnFormatDate(value, false);
  }

}
