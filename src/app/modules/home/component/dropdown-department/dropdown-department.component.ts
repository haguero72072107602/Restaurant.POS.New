import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";
import {Dropdown} from "flowbite";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {Department} from "@models/department.model";
import {StockService} from "@core/services/bussiness-logic/stock.service";

@Component({
  selector: 'app-dropdown-department',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-department.component.html',
  styleUrl: './dropdown-department.component.css'
})
export class DropdownDepartmentComponent implements AfterViewInit {
  @Output() evSelectedDepartment = new EventEmitter<Department>();

  public departments: Department[] = [];
  public dropdown?: Dropdown;
  public titleSearch: string = "Search department";


  constructor(private stockInvoice: StockService) {
  }

  ngOnInit(): void {
    this.stockInvoice.getDepartments().subscribe((next: Department[]) => {
      console.log("list modifiers", next);
      this.departments = next;
    });
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearchModifier');
    const $triggerEl = document.getElementById('dropdownSearchButtonModifier');

    this.dropdown = new Dropdown($targetEl, $triggerEl);
  }

  selectItem(item: Department) {
    this.titleSearch = item.name;
    this.dropdown?.hide();
    this.evSelectedDepartment?.emit(item);
  }
}
