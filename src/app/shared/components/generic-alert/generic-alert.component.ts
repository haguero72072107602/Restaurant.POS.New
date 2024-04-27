import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";


@Component({
  selector: 'app-generic-alert',
  templateUrl: './generic-alert.component.html',
  styleUrls: ['./generic-alert.component.css']
})
export class GenericAlertComponent implements OnInit {
  public colorBg: string = "primary";
  protected readonly DialogType = DialogType;
  protected readonly DialogConfirm = DialogConfirm;

  constructor(public dialogRef: MatDialogRef<GenericAlertComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close({confirm: true});
  }

  close() {
    this.dialogRef.close();
  }

  getColorPrimary(sigla: string) {
    switch (this.data.dialogType as DialogType) {
      case DialogType.DT_ERROR:
        return sigla + ': #F35C6E';
      case DialogType.DT_SUCCESS:
        return sigla + ': #32A68E';
      case DialogType.DT_WARNING:
        return sigla + ': #EAC11D';
      case DialogType.DT_INFORMATION:
        return sigla + ': #49488E';
      default:
        return sigla + ': #F35C6E';
    }
  }

  getColorSecundary(sigla: string) {
    switch (this.data.dialogType as DialogType) {
      case DialogType.DT_ERROR:
        return sigla + ': #F3E5E6';
      case DialogType.DT_SUCCESS:
        return sigla + ': #DAEFEB';
      case DialogType.DT_WARNING:
        return sigla + ': #F3F3E5';
      case DialogType.DT_INFORMATION:
        return sigla + ': #E5E5F3';
      default:
        return sigla + ': #F3E5E6';
    }
  }

  GetTextInfo() {
    if (!this.data.headerTitle) {
      switch (this.data.dialogType) {
        case DialogType.DT_ERROR:
          return 'Error';
        case DialogType.DT_SUCCESS:
          return 'Success';
        case DialogType.DT_WARNING:
          return 'Warning';
        case DialogType.DT_INFORMATION:
          return 'Information';
        default:
          return 'Error';
      }
    } else return this.data.headerTitle
  }
}
