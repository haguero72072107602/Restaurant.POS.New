import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product, ProductOrder} from 'src/app/models';
import {Theme} from 'src/app/models/theme';
import {ListInvoicesComponent} from "@shared/components/list-invoices/list-invoices.component";


@Component({
  selector: 'app-sides-prepare',
  templateUrl: './sides-prepare.component.html',
  styleUrls: ['./sides-prepare.component.scss']
})
export class SidesPrepareComponent implements OnInit {
  @ViewChild('side') listSide!: ListInvoicesComponent;
  @ViewChild('extra') listExtra!: ListInvoicesComponent;
  @ViewChild('mode') listMode!: ListInvoicesComponent;
  @ViewChild('open') listOpen!: ListInvoicesComponent;
  @Input() title = 'Sides and Preparation Modes';
  @Input() label = 'Price';
  pageSides = 1;
  pageModes = 1;
  pageExtraSides = 1;
  pageOpenSides = 1;
  sizePage = 12;
  breakText = 'break-word';
  sides: any;
  modes: any;
  extraSides: any;
  openSides: any;
  selectedSides: any[] = [];
  selectedExtraSides: any[] = [];
  selectedOpenSides: any[] = [];
  selectedMode: any[] = [];
  idPaginatorSides = 'sides';
  idPaginatorExtraSides = 'extraSides';
  idPaginatorOpenSides = 'openSides';
  idPaginatorModes = 'mode';
  limitSides!: number;
  sizePageExtras = 8;

  theme: string = this.th.theme;

  constructor(private th: Theme, public dialogRef: MatDialogRef<SidesPrepareComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    console.log('onInit', this.data);
    if (this.data.options) {
      if (this.data.options.sides !== undefined) {
        this.sides = {invoice: this.data.options.sides, label: 'name'};
        this.selectedSides = this.data.options.sides.filter((v: any) => v.selected);
      }
      if (this.data.options.preparationModes !== undefined) {
        this.modes = {invoice: this.data.options.preparationModes, label: 'name'};
        this.selectedMode = this.data.options.preparationModes.filter((v: any) => v.selected);
      }
      if (this.data.options.extraSides !== undefined) {
        this.extraSides = {invoice: this.data.options.extraSides, label: 'name'};
        this.selectedExtraSides = this.data.options.extraSides.filter((v: any) => v.selected);
      }
      if (this.data.options.openSides !== undefined) {
        this.openSides = {invoice: this.data.options.openSides, label: 'name', detail: 'unitCost'};
        this.selectedOpenSides = this.data.options.openSides.filter((v: any) => v.selected);
      }
    }
    if (this.data.limitSides) {
      this.limitSides = this.data.limitSides;
    }
    if (this.data.label) {
      this.label = this.data.label;
    }
    if (this.data.product) {
      let name = this.data.product['name'] ? this.data.product['name'] :
        this.data.product['productName'] ? this.data.product['productName'] : '';
      this.title += " (" + name + ")";
    }
  }

  addProdOptions() {
    this.dialogRef.close({
      sides: this.listSide !== undefined ? this.listSide.itemsSelected : [],
      extras: this.listExtra !== undefined ? this.listExtra.itemsSelected : [],
      open: this.listOpen !== undefined ? this.listOpen.itemsSelected : [],
      modes: this.listMode !== undefined ? this.listMode.itemsSelected : []
    });
  }

  setPageSide(ev: any) {
    console.log(ev);
    this.pageSides = ev;
  }

  setPageMode(ev: any) {
    console.log(ev);
    this.pageModes = ev;
  }

  setPageExtra(ev: any) {
    console.log(ev);
    this.pageExtraSides = ev;
  }

  setPageOpenSide(ev: any) {
    console.log(ev);
    this.pageOpenSides = ev;
  }

  showSides() {
    return this.data.options.sides !== undefined && this.data.options.sides.length > 0;
  }

  showExtraSides() {
    return this.data.options.extraSides !== undefined && this.data.options.extraSides.length > 0;
  }

  showModes() {
    return this.data.options.preparationModes !== undefined && this.data.options.preparationModes.length > 0;
  }

  showOpenSides() {
    return this.data.options.openSides !== undefined && this.data.options.openSides.length > 0;
  }
}
