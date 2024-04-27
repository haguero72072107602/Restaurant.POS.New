import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Dropdown} from "flowbite";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {Inventory} from "@models/inventory";

@Component({
  standalone: true,
  selector: 'app-dropdown-component',
  templateUrl: './dropdown-component.component.html',
  styleUrl: './dropdown-component.component.css'
})
export class DropdownComponentComponent implements AfterViewInit, OnInit {

  @Output() evSelectedInvoice = new EventEmitter<Inventory>();

  public invoices?: Inventory[]
  public dropdown?: Dropdown;
  public titleSearch: string = "Search";


  constructor(private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe((next: Inventory[]) => {
      console.log("list inventory", next);
      this.invoices = next;
    });
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearch');
    const $triggerEl = document.getElementById('dropdownSearchButton');

    this.dropdown = new Dropdown($targetEl, $triggerEl);
  }


  selectItem(item: Inventory) {
    this.titleSearch = item.name;
    this.dropdown?.hide();
    this.evSelectedInvoice?.emit(item);
  }

}
