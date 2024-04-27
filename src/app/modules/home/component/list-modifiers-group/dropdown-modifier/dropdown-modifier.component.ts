import {Component, EventEmitter, Output} from '@angular/core';
import {Inventory} from "@models/inventory";
import {Dropdown} from "flowbite";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {ModifiersGroup} from "@models/modifier.model";

@Component({
  standalone: true,
  selector: 'app-dropdown-modifier',
  templateUrl: './dropdown-modifier.component.html',
  styleUrl: './dropdown-modifier.component.css'
})
export class DropdownModifierComponent {
  @Output() evSelectedModifierGroup = new EventEmitter<ModifiersGroup>();

  public modifiers: ModifiersGroup[] = [];
  public dropdown?: Dropdown;
  public titleSearch: string = "Search component";


  constructor(private modifierService: ModifierService) {
  }

  ngOnInit(): void {
    this.modifierService.getModifierGroup().subscribe((next: ModifiersGroup[]) => {
      console.log("list modifiers", next);
      this.modifiers = this.modifierService.excludeModifierGroupHide(next);
    });
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearchModifier');
    const $triggerEl = document.getElementById('dropdownSearchButtonModifier');

    this.dropdown = new Dropdown($targetEl, $triggerEl);
  }


  selectItem(item: ModifiersGroup) {
    this.titleSearch = item.description;
    this.dropdown?.hide();
    this.evSelectedModifierGroup?.emit(item);
  }

  clearSelected() {
    this.titleSearch = "Search component";
  }

}
