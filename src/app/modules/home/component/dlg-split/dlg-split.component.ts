import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {arraySplit} from "@models/split.model";
import {AuthService} from "@core/services/api/auth.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-dlg-split',
  templateUrl: './dlg-split.component.html',
  styleUrls: ['./dlg-split.component.css']
})
export class DlgSplitComponent implements OnInit {

  //countPosition: number = 0;
  @Input() arrayPosition: arraySplit[] = [];
  split?: any[][] = [];

  splitRemove: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<DlgSplitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.arrayPosition = this.data["positionTable"];
    //console.log("Count ", this.countPosition);
    //for (let i = 1; i <= this.countPosition; i++) {
    //  this.arrayPosition.push({id: i, selected: false, visible: true})
    //}
  }

  onClose() {
    this.dialogRef.close()
  }

  OnCloseOk() {
    if (this.split!.length > 0) {
      if (this.arrayPosition.filter(p => p.visible).length > 0) {
        this.utilsService.openGenericInfo("Error", "Existe definiciones por realiza");
      } else {
        return this.dialogRef.close({split: this.split})
      }
    } else this.dialogRef.close()
  }

  /* move position */
  addArrPosition() {
    const addArray: arraySplit[] = [];

    this.arrayPosition.forEach((p, index) => {
      if (p.selected) {
        addArray.push(p);
        p.selected = false;
        p.visible = false;
      }
    })

    if (addArray.length > 0) {
      this.split!.push(addArray)
    }
  }

  removeArrPosition() {
    if (this.splitRemove.length > 0) {
      this.arrayPosition.forEach(f => {
        if (this.splitRemove.includes(f.id)) {
          f.visible = true;
        }
      });

      this.split = this.split!.filter(s => {

        const arrData = this.getFields(s, "id");

        console.log("Find data", arrData);

        const found = arrData.find(l => this.splitRemove.includes(l));

        console.log("Exist in array", found);

        return !found;
      });

      this.splitRemove = [];

    }
  }

  getFields(input: any, field: any) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
      output.push(input[i][field]);
    return output;
  }


  onSelectedSplit($event: arraySplit[]) {

    $event.forEach(split => {
      let found = this.splitRemove.filter(n => n === split.id);

      if (found.length > 0) {
        this.splitRemove = this.splitRemove.filter(n => n != split.id);
      } else {
        this.splitRemove.push(split.id)
      }
    })
  }

}
